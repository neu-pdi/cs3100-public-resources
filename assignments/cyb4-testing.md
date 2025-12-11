---
title: "Assignment 4: Services, OCR, and Testing"
sidebar_position: 5
---

## Overview

## Learning Outcomes

## AI policy for this assignment

## Technical Specifications

### Domain Concepts

### Ingredient Parsing

*(Moved from A3)*

Parses ingredient strings into `Ingredient` objects.

**Required Methods:**
```java
public class IngredientParser {
    /**
     * Parses a single ingredient string into an Ingredient object.
     * 
     * @param text the ingredient text to parse
     * @return the parsed Ingredient (MeasuredIngredient or VagueIngredient)
     * @throws ParseException if the text cannot be parsed
     */
    public static @NonNull Ingredient parse(@NonNull String text);
    
    /**
     * Parses multiple ingredients from a multi-line string.
     * Each non-blank line is parsed as a separate ingredient.
     * 
     * @param multiLineText the text containing multiple ingredients
     * @return list of parsed ingredients
     * @throws ParseException if any line cannot be parsed
     */
    public static @NonNull List<Ingredient> parseAll(@NonNull String multiLineText);
}
```

**Note:** You must create a `ParseException` class (checked exception) for parsing failures.

**Required Formats (must parse correctly for full credit):**

These formats will be tested by the automated grading system:

| Input | Expected Result |
|-------|-----------------|
| `"2 cups flour"` | MeasuredIngredient: ExactQuantity(2, CUP), name="flour" |
| `"1/2 cup sugar"` | MeasuredIngredient: FractionalQuantity(0, 1, 2, CUP), name="sugar" |
| `"2 1/2 tbsp butter"` | MeasuredIngredient: FractionalQuantity(2, 1, 2, TABLESPOON), name="butter" |
| `"3-4 cloves garlic"` | MeasuredIngredient: RangeQuantity(3, 4, WHOLE), name="garlic", notes="cloves" or similar |
| `"100 g chocolate"` | MeasuredIngredient: ExactQuantity(100, GRAM), name="chocolate" |
| `"1 lb ground beef"` | MeasuredIngredient: ExactQuantity(1, POUND), name="ground beef" |
| `"salt to taste"` | VagueIngredient: name="salt", description="to taste" |
| `"fresh herbs"` | VagueIngredient: name="fresh herbs" |
| `"2 cups flour, sifted"` | MeasuredIngredient: name="flour", preparation="sifted" |
| `"3 eggs, beaten"` | MeasuredIngredient: ExactQuantity(3, WHOLE), name="eggs", preparation="beaten" |

**Encouraged Formats (bonus exploration, not graded):**

Challenge yourself (and your AI assistant) with these additional formats:

- `"1570g pomegranate juice (aka 1 x 148oz bottle pom wonderful juice)"` - measurement with a note
- `"2 cups (250g) flour"` - dual measurements
- `"1 (14 oz) can diced tomatoes"` - packaged ingredients
- `"one large egg"` - word numbers
- `"a handful of basil"` - informal quantities
- `"zest of 1 lemon"` - derived ingredients
- `"2 to 3 tablespoons olive oil"` - word ranges

**Design Guidance:**
- Start with simple cases and add complexity incrementally
- Use AI to help with regex patterns and parsing logic
- Test extensively—parsing is where most bugs hide
- It's okay if some edge cases fail; document limitations

### Class Design

### Invariants and Contracts

### Design Requirements

### Example Usage

### Testing Requirements

### Reflection

## Quality Requirements

## Grading Rubric

## Submission
