namespace LyraBit.Core.DTOs;

public sealed record CategoryBreakdownDto(
    string Category,
    decimal Total,
    int Count);

public sealed record MonthlyTotalDto(
    int Year,
    int Month,
    decimal Total);

public sealed record AnalyticsSummaryDto(
    decimal TotalThisMonth,
    decimal TotalLastMonth,
    int? DeltaPct,
    int TransactionCountThisMonth,
    int FlaggedCount,
    decimal AverageRiskScore,
    IReadOnlyList<CategoryBreakdownDto> CategoryBreakdown,
    IReadOnlyList<MonthlyTotalDto> LastSixMonths);
