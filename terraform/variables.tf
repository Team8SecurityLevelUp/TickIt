variable "budget_notification_emails" {
  description = "List of email addresses to receive AWS Budget notifications"
  type        = list(string)
  default     = [
    "shashin.gounden@bbd.co.za",
    "Mnqobi.Nkabinde@bbd.co.za",
    "Lerato.Taunyane@bbd.co.za",
    "lindiwe@bbd.co.za",
    "rudolphe@bbdsoftware.com"
  ]
}
