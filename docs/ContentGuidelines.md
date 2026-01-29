# Content Guidelines for Astronomy App

## Overview

This document outlines the content policy and guidelines for the Interactive Astronomy & Monotheism Exploration App. All content must adhere to these guidelines to maintain academic integrity and religious accuracy.

## Content Types

### 1. Quranic Content (القرآن الكريم)

**Requirements:**
- Must be verbatim from the Quran - NO modifications
- Must include accurate Surah name and Ayah number
- Must use proper Arabic typography (Amiri font)
- Must be visually distinct (green background, special styling)
- Must be verified for accuracy before inclusion

**Validation:**
```typescript
- Contains Arabic characters (Unicode range \u0600-\u06FF)
- Has reference in format "Surah:Ayah"
- Text matches official Mushaf
```

**Visual Treatment:**
- Green emerald background (`bg-emerald-900/20`)
- Large font size (text-3xl)
- Amiri font family
- Centered alignment
- Reference displayed below verse

### 2. Tafsir Content (التفسير)

**Requirements:**
- Must be from classical sources only:
  - Ibn Kathir (ابن كثير)
  - Al-Tabari (الطبري)
  - Al-Qurtubi (القرطبي)
  - Al-Sa'di (السعدي)
- Must be shortened/summarized, not full tafsir
- Must clearly state the source
- **MUST include disclaimer**: "تفسير مختصر من مصادر كلاسيكية"

**Visual Treatment:**
- Amber disclaimer badge
- Source label visible
- Separate section with clear borders
- Warning icon

### 3. Reflection Content (التأمل)

**Requirements:**
- Educational and academic tone only
- NOT preachy or directive
- Must present facts and logical conclusions
- **MUST include disclaimer**: "رأي تعليمي تأملي - يُراجع من مختص"

**Visual Treatment:**
- Blue disclaimer badge
- Quote marks around text
- Gradient background
- Information icon

### 4. Scientific Content (المحتوى العلمي)

**Requirements:**
- Accurate astronomical facts
- Simplified for general audience
- No technical jargon
- Verifiable from scientific sources

**Structure:**
- Type (نوع)
- Distance (مسافة)
- Size (حجم)
- Brightness (سطوع)
- Description (وصف)

### 5. Historical Content (السياق التاريخي)

**Requirements:**
- Factual historical information
- Documented worship practices
- Clear statement that worship was invalid
- No speculation

**Structure:**
- Who worshipped it (عُبد من قِبل)
- Reason for worship (سبب العبادة)
- Islamic verdict (حكم)

## Separation of Content

### Critical Rules

1. **Quranic Text vs Tafsir**
   - NEVER mix Quranic text with interpretation
   - Quranic text stands alone in its section
   - Tafsir references the verse but doesn't repeat it

2. **Tafsir vs Reflection**
   - Tafsir = classical scholarly interpretation
   - Reflection = modern educational thought
   - Keep these clearly separated

3. **Science vs Religion**
   - Scientific facts in their own section
   - No mixing of scientific terminology with religious content
   - Present both respectfully and independently

## Content Validation

### Before Adding New Content

Run validation script:
```bash
npm run validate:content
```

### Manual Checks

- [ ] Quranic text verified against Mushaf
- [ ] Tafsir source properly attributed
- [ ] Disclaimers present for Tafsir and Reflection
- [ ] No mixing of content types
- [ ] Arabic typography correct
- [ ] RTL layout functioning
- [ ] Visual distinction clear

## Disclaimers

### Tafsir Disclaimer
```typescript
<ContentDisclaimer type="tafsir" source="ابن كثير" />
```

Displays: "تنبيه: تفسير مختصر من مصادر كلاسيكية (ابن كثير)"

### Reflection Disclaimer
```typescript
<ContentDisclaimer type="reflection" />
```

Displays: "ملاحظة: رأي تعليمي تأملي - يُراجع من مختص"

## Prohibited Content

**NEVER include:**
- Modified Quranic text
- Personal religious opinions
- Sectarian interpretations
- Unverified hadiths
- Speculative astronomical claims
- Directive/preachy language

## Review Process

### Before Deployment

1. **Technical Review**
   - Run `npm run validate:content`
   - Check TypeScript types
   - Verify visual rendering

2. **Content Review**
   - Verify all Quranic verses
   - Check Tafsir sources
   - Review reflection tone
   - Ensure disclaimers present

3. **Religious Scholar Review** ⚠️
   - **MANDATORY before public release**
   - Have qualified Islamic scholar review:
     - Quranic text accuracy
     - Tafsir appropriateness
     - Reflection content
     - Overall religious messaging

<parameter name="Complexity">6
