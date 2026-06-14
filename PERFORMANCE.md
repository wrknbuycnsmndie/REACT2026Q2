# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Action**: Changed sorting from Population to Name
- **Commit duration**: N/A
- **Render duration**: 275.1 ms
- **Screenshot**:

![Sort countries baseline](/public/screenshots/baseline/sort-population-before-optimization.png)

### Interaction B: Search countries

- **Action**: Entered search query `united`
- **Commit duration**: N/A
- **Render duration**: 219.4 ms
- **Screenshot**:

![Search countries baseline](/public/screenshots/baseline/search-country-before-optimization.png)

### Interaction C: Change year

- **Action**: Changed year from 2020 to 2021
- **Commit duration**: N/A
- **Render duration**: 276.4 ms
- **Screenshot**:

![Change year baseline](/public/screenshots/baseline/year-selection-before-optimization.png)

### Interaction D: Toggle column

- **Action**: Added `oil_co2` column
- **Commit duration**: N/A
- **Render duration**: 277.7 ms
- **Screenshot**:

![Toggle column baseline](/public/screenshots/baseline/add-column-before-optimization.png)

## Baseline Analysis

Most rendering time is spent inside the `CountryList` component.

| Interaction      | Render duration |
| ---------------- | --------------: |
| Sort countries   |        275.1 ms |
| Search countries |        219.4 ms |
| Change year      |        276.4 ms |
| Toggle column    |        277.7 ms |

## Optimized Measurements

_To be filled after optimizations._

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------: | -------------: | ----------: |
| Sort countries   |         275.1 |         \_\_\_ |     \_\_\_% |
| Search countries |         219.4 |         \_\_\_ |     \_\_\_% |
| Change year      |         276.4 |         \_\_\_ |     \_\_\_% |
| Toggle column    |         277.7 |         \_\_\_ |     \_\_\_% |
| **Average**      |    **262.15** |     **\_\_\_** | **\_\_\_%** |
