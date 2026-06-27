# Textarea Limits Rule

## Non-Expandable Textareas

All textarea fields in the application must have controlled sizing to prevent unlimited expansion.

### Requirements:

1. **Always add `resize-none` class** to prevent the resize handle/drag corner
   ```jsx
   <textarea className="resize-none" ... />
   ```

2. **Always add `maxLength` attribute** to limit character input
   ```jsx
   <textarea maxLength={200} ... />
   ```

3. **Show character counter** for longer text fields (optional but recommended)
   ```jsx
   <textarea maxLength={200} ... />
   <p className="text-xs text-gray-400 mt-1">{value.length}/200</p>
   ```

### Recommended Max Lengths:

| Field Type | Max Length |
|------------|------------|
| Short description | 100-150 |
| Standard description | 200-300 |
| Long description | 500-1000 |
| Content blocks | 2000-5000 |

### Example:
```jsx
<textarea
  value={value}
  onChange={(e) => handleChange(e.target.value)}
  placeholder="Enter description..."
  rows={3}
  maxLength={200}
  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
/>
<p className="text-xs text-gray-400 mt-1">{value.length}/200</p>
```

### Created: 2025-01-23
### Status: Apply to all textarea fields in the application