# Form Labels Style Rule

## Required Asterisk Style for Form Labels

All required field labels in forms must use the following format:

```jsx
<label htmlFor="fieldName" className="...">
  Label Text<sup className="text-red-500">*</sup>
</label>
```

### Key Points:
1. **Red Asterisk**: Use `text-red-500` class for red color
2. **Superscript**: Use `<sup>` HTML tag to position asterisk on top
3. **No Space**: No space between label text and `<sup>` tag

### Example:
```jsx
// ✅ Correct
<label htmlFor="email" className="...">
  Email ID<sup className="text-red-500">*</sup>
</label>

// ❌ Wrong
<label htmlFor="email" className="...">
  Email ID*
</label>

// ❌ Wrong (with space)
<label htmlFor="email" className="...">
  Email ID <sup className="text-red-500">*</sup>
</label>
```

---

## Input Character Limits

All input fields must have appropriate `maxLength` attribute to prevent unlimited character input.

```jsx
<input
  type="text"
  maxLength={...}
  ...
/>
```

### Key Points:
1. Always add `maxLength` attribute to input fields
2. Choose appropriate limits based on field type
3. Prevents unlimited character input and improves UX

---

## Error Messages - Strip HTML Tags

All error messages displayed from API responses must strip HTML tags to prevent markup from showing literally.

```javascript
let message = error.response?.data?.message || 'Default error message.';
// Strip HTML tags from error message
message = message.replace(/<[^>]*>/g, '');
```

### Key Points:
1. Always strip HTML tags before displaying error messages
2. Prevents `<p>`, `<div>`, etc. from showing literally
3. Ensures clean, readable inline error messages

### Created: 2025-01-22
### Status: Apply to all forms throughout the application