using UnityEngine;

public class MobileSpaceCamera : MonoBehaviour
{
    [Header("Orbit Settings")]
    public Transform target;          // The object to orbit around (e.g., Sun)
    public float distance = 50.0f;    // Distance from target
    public float xSpeed = 120.0f;     // Rotation speed (X-axis)
    public float ySpeed = 120.0f;     // Rotation speed (Y-axis)

    [Header("Zoom Settings")]
    public float zoomSpeed = 50.0f;   // Pinch-to-zoom sensitivity
    public float minDistance = 20.0f; // Closest zoom
    public float maxDistance = 1000f; // Furthest zoom

    [Header("Smoothing")]
    public bool smooth = true;
    public float smoothTime = 0.1f;   // Inertia damping time

    // Internal Rotation State
    private float x = 0.0f;
    private float y = 0.0f;
    
    // Damping Velocities
    private float xVelocity = 0.0f;
    private float yVelocity = 0.0f;
    private float currentDistance;
    private float distanceVelocity = 0.0f; // For zoom damping

    void Start()
    {
        // 4. Far Clip Plane (User Request)
        Camera cam = GetComponent<Camera>();
        if (cam != null)
        {
            cam.farClipPlane = 1000000f;
        }

        Vector3 angles = transform.eulerAngles;
        x = angles.y;
        y = angles.x;

        currentDistance = distance;

        // Auto-find target if null
        if (target == null)
        {
            GameObject sun = GameObject.Find("Sun"); 
            if (sun != null) target = sun.transform;
        }
    }

    void LateUpdate()
    {
        if (target)
        {
            // -----------------------------
            // 1. TOUCH INPUT HANDLING
            // -----------------------------
            if (Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Moved)
            {
                // One-Finger Drag: Rotate Orbit
                Touch touch = Input.GetTouch(0);
                x += touch.deltaPosition.x * xSpeed * 0.02f;
                y -= touch.deltaPosition.y * ySpeed * 0.02f;
            }
            
            // -----------------------------
            // 2. PINCH TO ZOOM
            // -----------------------------
            if (Input.touchCount == 2)
            {
                Touch touchZero = Input.GetTouch(0);
                Touch touchOne = Input.GetTouch(1);

                Vector2 touchZeroPrevPos = touchZero.position - touchZero.deltaPosition;
                Vector2 touchOnePrevPos = touchOne.position - touchOne.deltaPosition;

                float prevTouchDeltaMag = (touchZeroPrevPos - touchOnePrevPos).magnitude;
                float touchDeltaMag = (touchZero.position - touchOne.position).magnitude;

                float deltaMagnitudeDiff = prevTouchDeltaMag - touchDeltaMag;

                // Pinch IN (Positive) -> Zoom Out (Increase Distance)
                // Pinch OUT (Negative) -> Zoom In (Decrease Distance)
                distance += deltaMagnitudeDiff * zoomSpeed * 0.01f;
            }

            // Clamp Zoom
            distance = Mathf.Clamp(distance, minDistance, maxDistance);

            // -----------------------------
            // 3. SMOOTHING & ORBIT LOGIC
            // -----------------------------
            if (smooth)
            {
                // Smooth Rotation
                float currentX = Mathf.SmoothDampAngle(transform.eulerAngles.y, x, ref xVelocity, smoothTime);
                float currentY = Mathf.SmoothDampAngle(transform.eulerAngles.x, y, ref yVelocity, smoothTime);
                
                // Smooth Zoom
                currentDistance = Mathf.SmoothDamp(currentDistance, distance, ref distanceVelocity, smoothTime);

                Quaternion rotation = Quaternion.Euler(currentY, currentX, 0);
                Vector3 negDistance = new Vector3(0.0f, 0.0f, -currentDistance);
                Vector3 position = rotation * negDistance + target.position;

                transform.rotation = rotation;
                transform.position = position;
            }
            else
            {
                Quaternion rotation = Quaternion.Euler(y, x, 0);
                Vector3 negDistance = new Vector3(0.0f, 0.0f, -distance);
                Vector3 position = rotation * negDistance + target.position;

                transform.rotation = rotation;
                transform.position = position;
            }
        }
    }
}
