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
- **Render duration**: 145.9 ms
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
| Search countries |        145.9 ms |
| Change year      |        276.4 ms |
| Toggle column    |        277.7 ms |

## Optimized Measurements

### Interaction A: Sort countries

- **Action**: Changed sorting from Population to Name
- **Commit duration**: N/A
- **Render duration**: 29.7 ms
- **Screenshot**:

![Sort countries optimized](/public/screenshots/optimized/sort-population-after-optimization.png)

### Interaction B: Search countries

- **Action**: Entered search query `united`
- **Commit duration**: N/A
- **Render duration**: 32.8 ms
- **Screenshot**:

![Search countries optimized](/public/screenshots/optimized/search-country-after-optimization.png)

### Interaction C: Change year

- **Action**: Changed year from 2020 to 2021
- **Commit duration**: N/A
- **Render duration**: 52.2 ms
- **Screenshot**:

![Change year optimized](/public/screenshots/optimized/year-selection-after-optimization.png)

### Interaction D: Toggle column

- **Action**: Added `oil_co2` column
- **Commit duration**: N/A
- **Render duration**: 13.7 ms
- **Screenshot**:

![Toggle column optimized](/public/screenshots/optimized/add-column-after-optimization.png)

## Optimized Analysis

Virtualization limits rendering to visible country cards, while memoization prevents unrelated
components and computed values from being processed again. All measured interactions render
much faster than the baseline.

| Interaction      | Render duration |
| ---------------- | --------------: |
| Sort countries   |         29.7 ms |
| Search countries |         32.8 ms |
| Change year      |         52.2 ms |
| Toggle column    |         13.7 ms |

## Summary of Improvements

| Interaction      |      Baseline |    Optimized |    Time saved | Improvement |
| ---------------- | ------------: | -----------: | ------------: | ----------: |
| Sort countries   |      275.1 ms |      29.7 ms |      245.4 ms |      89.20% |
| Search countries |      145.9 ms |      32.8 ms |      113.1 ms |      77.52% |
| Change year      |      276.4 ms |      52.2 ms |      224.2 ms |      81.11% |
| Toggle column    |      277.7 ms |      13.7 ms |      264.0 ms |      95.07% |
| **Average**      | **243.77 ms** | **32.10 ms** | **211.67 ms** |  **86.83%** |
