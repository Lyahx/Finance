namespace LyraBit.API.Constants;

public static class ApiRoutes
{
    public const string Base = "api/v1";

    public static class Auth
    {
        public const string Controller = Base + "/auth";
        public const string Register = "register";
        public const string Login = "login";
    }

    public static class Wallet
    {
        public const string Controller = Base + "/wallet";
        public const string AddFunds = "add-funds";
    }

    public static class Transactions
    {
        public const string Controller = Base + "/transactions";
        public const string Transfer = "transfer";
        public const string ById = "{id:guid}";
        public const string AnalyticsSummary = "analytics/summary";
        public const string Confirm = "{id:guid}/confirm";
    }

    public static class Users
    {
        public const string Controller = Base + "/users";
        public const string Me = "me";
        public const string Search = "search";
    }

    public static class Categories
    {
        public const string Controller = Base + "/categories";
    }

    public static class Notifications
    {
        public const string Controller = Base + "/notifications";
    }
}
