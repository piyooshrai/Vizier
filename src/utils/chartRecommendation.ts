// src/utils/chartRecommendation.ts

export type ChartType =
  | 'bar_chart'
  | 'horizontal_bar_chart'
  | 'line_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'table'
  | 'big_number';

interface ChartRecommendation {
  type: ChartType;
  reason: string;
}

export function recommendChartType(
  data: Record<string, unknown>[],
  question: string,
): ChartRecommendation {
  if (!data || data.length === 0) {
    return {
      type: 'table',
      reason: 'No data to visualize',
    };
  }

  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  const rowCount = data.length;

  // Analyze column types
  const datePattern = /date|month|year|time|period|day|week/i;
  const hasDateColumn = columns.some((col) => datePattern.exec(col) !== null);

  const percentPattern = /percent|rate|ratio|proportion/i;
  const hasPercentage = columns.some(
    (col) =>
      percentPattern.exec(col) !== null ||
      firstRow[col]?.toString().includes('%'),
  );

  const numericColumns = columns.filter(
    (col) => typeof firstRow[col] === 'number',
  );

  // Decision tree based on data structure and question

  // 1. Single value questions
  if (rowCount === 1 && numericColumns.length === 1) {
    return {
      type: 'big_number',
      reason:
        "I'm showing this as a prominent number since it's a single metric—makes it easy to grasp at a glance.",
    };
  }

  // 2. Time series data
  if (hasDateColumn && numericColumns.length >= 1) {
    return {
      type: 'line_chart',
      reason:
        "I'm using a line chart to show the trend over time—this makes it easy to spot patterns and changes.",
    };
  }

  // 3. Distribution/proportions
  const distributionPattern =
    /distribution|breakdown|composition|percentage|proportion/i;
  if (hasPercentage || distributionPattern.exec(question) !== null) {
    if (rowCount <= 6) {
      return {
        type: 'pie_chart',
        reason:
          "I'm showing this as a pie chart because it clearly illustrates how the whole breaks down into parts.",
      };
    } else {
      return {
        type: 'bar_chart',
        reason:
          "I'm using a bar chart instead of pie because with this many categories, bars are easier to compare accurately.",
      };
    }
  }

  // 4. Rankings and top/bottom lists
  const rankingPattern = /top|bottom|highest|lowest|best|worst/i;
  if (rankingPattern.exec(question) !== null) {
    if (rowCount <= 15) {
      return {
        type: 'horizontal_bar_chart',
        reason:
          "I'm using horizontal bars to make category labels easy to read while clearly showing the rankings.",
      };
    } else {
      return {
        type: 'bar_chart',
        reason:
          "I'm showing this as a bar chart to make it easy to compare values at a glance.",
      };
    }
  }

  // 5. Detailed tabular data
  if (numericColumns.length > 2 || rowCount > 20) {
    return {
      type: 'table',
      reason:
        "I'm presenting this as a table because there are multiple dimensions to explore—you can scan the details more easily this way.",
    };
  }

  // 6. Small datasets
  if (rowCount <= 5) {
    return {
      type: 'donut_chart',
      reason:
        "I'm using a donut chart for this small set of categories—it's clean and shows proportions clearly.",
    };
  }

  // Default: Bar chart for comparisons
  return {
    type: 'bar_chart',
    reason:
      "I'm showing this as a bar chart because it makes comparing the different categories straightforward.",
  };
}
