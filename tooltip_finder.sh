#!/bin/bash

echo "file,component_name,line_number" > tooltip_usage.csv

for file in $(find src -type f -name "*.js" -o -name "*.tsx" -o -name "*.jsx" | xargs grep -l "<Tooltip" | xargs grep -l "import.*Tooltip.*from '[^@]" | grep -v "__tests__" | grep -v "__snapshots__" | grep -v "stories\.tsx" | sort); do
  # Extract component name using different approaches
  
  # Look for const ComponentName = () => or function ComponentName()
  component_name=$(grep -E "^(const|function) ([A-Z][A-Za-z0-9_]+)" "$file" | head -1 | sed -E 's/^(const|function) ([A-Za-z0-9_]+).*/\2/g' | tr -d '{;=() ')
  
  # If not found, try class ComponentName extends
  if [ -z "$component_name" ]; then
    component_name=$(grep -E "^class ([A-Z][A-Za-z0-9_]+)" "$file" | head -1 | sed -E 's/^class ([A-Za-z0-9_]+).*/\1/g' | tr -d '{;')
  fi
  
  # If not found, try export default ComponentName or module.exports = ComponentName
  if [ -z "$component_name" ]; then
    component_name=$(grep -E "(export default|module\.exports =) ([A-Z][A-Za-z0-9_]+)" "$file" | head -1 | sed -E 's/.*(export default|module\.exports =) ([A-Za-z0-9_]+).*/\2/g' | tr -d '{;}')
  fi
  
  # Finally use the filename as a fallback
  if [ -z "$component_name" ]; then
    component_name=$(basename "$file" | sed -E 's/\.[^.]+$//' | sed -E 's/(^|[-_])([a-z])/\U\2/g')
  fi
  
  # Find all lines with Tooltip usage
  grep -n "<Tooltip" "$file" | while read -r line; do
    line_number=$(echo "$line" | cut -d ':' -f 1)
    # Format for CSV with proper escaping
    file_escaped=$(echo "$file" | sed 's/"/""/g')
    component_escaped=$(echo "$component_name" | sed 's/"/""/g')
    echo "\"$file_escaped\",\"$component_escaped\",$line_number" >> tooltip_usage.csv
  done
done

# Count the total number of tooltips
total_tooltips=$(grep -v "file,component_name" tooltip_usage.csv | wc -l)
echo ""
echo "Total non-Blueprint tooltips found: $total_tooltips"
echo "Results saved to tooltip_usage.csv (stories.tsx files excluded)" 