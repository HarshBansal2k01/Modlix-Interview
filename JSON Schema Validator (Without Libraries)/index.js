function validateJson(schema, data, path = "") {
  if (
    schema.type !== "object" ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return `Error: ${path || "Root"} should be an object`;
  }

  const requiredFields = schema.required || [];
  const properties = schema.properties || {};

  // Check for required fields
  for (const field of requiredFields) {
    if (!(field in data)) {
      return `Error: Missing required field '${path + field}'`;
    }
  }

  // Validate each field based on schema
  for (const field in data) {
    if (!properties[field]) {
      continue; // Allow extra fields
    }

    const fieldSchema = properties[field];
    const fieldType = fieldSchema.type;
    const value = data[field];

    if (fieldType === "string") {
      if (typeof value !== "string") {
        return `Error: '${path + field}' should be a string`;
      }
      if (fieldSchema.pattern) {
        const regex = new RegExp(fieldSchema.pattern);
        if (!regex.test(value)) {
          return `Error: '${path + field}' does not match pattern ${
            fieldSchema.pattern
          }`;
        }
      }
    } else if (fieldType === "integer") {
      if (!Number.isInteger(value)) {
        return `Error: '${path + field}' should be an integer`;
      }
      if ("minimum" in fieldSchema && value < fieldSchema.minimum) {
        return `Error: '${path + field}' should be at least ${
          fieldSchema.minimum
        }`;
      }
      if ("maximum" in fieldSchema && value > fieldSchema.maximum) {
        return `Error: '${path + field}' should be at most ${
          fieldSchema.maximum
        }`;
      }
    } else if (fieldType === "number") {
      if (typeof value !== "number") {
        return `Error: '${path + field}' should be a number (float allowed)`;
      }
      if ("minimum" in fieldSchema && value < fieldSchema.minimum) {
        return `Error: '${path + field}' should be at least ${
          fieldSchema.minimum
        }`;
      }
      if ("maximum" in fieldSchema && value > fieldSchema.maximum) {
        return `Error: '${path + field}' should be at most ${
          fieldSchema.maximum
        }`;
      }
    } else if (fieldType === "boolean") {
      if (typeof value !== "boolean") {
        return `Error: '${path + field}' should be a boolean (true/false)`;
      }
    } else if (fieldType === "array") {
      if (!Array.isArray(value)) {
        return `Error: '${path + field}' should be an array`;
      }
      if (fieldSchema.items) {
        for (let i = 0; i < value.length; i++) {
          if (typeof fieldSchema.items.type === "string") {
            if (typeof value[i] !== fieldSchema.items.type) {
              return `Error: '${path + field}[${i}]' should be of type ${
                fieldSchema.items.type
              }`;
            }
          }
        }
      }
    }
  }

  return "Valid JSON";
}

const schema = {
  type: "object",
  properties: {
    name: { type: "string", pattern: "^[A-Za-z ]+$" },
    age: { type: "integer", minimum: 18, maximum: 65 },
    isActive: { type: "boolean" },
    salary: { type: "number", minimum: 20000, maximum: 2000000 },
    skills: { type: "array", items: { type: "string" } },
  },
  required: ["name", "age", "isActive"],
};

//Valid JSON Object
const validData = {
  name: "Alice",
  age: 30,
  isActive: true,
  salary: 75000.5,
  skills: ["JavaScript", "Python"],
};

//Invalid JSON Object
const invalidData = {
  name: "Bob",
  age: 17, // Should be at least 18
  isActive: false,
  salary: "50000", // Should be a number, not a string
  skills: ["C++", 123], // Second skill is not a string
};

console.log(validateJson(schema, validData)); //Output: "Valid JSON"
console.log(validateJson(schema, invalidData));
//Output: "Error: 'age' should be at least 18"
//Output: "Error: 'salary' should be a number (float allowed)"
//Output: "Error: 'skills[1]' should be of type string"
