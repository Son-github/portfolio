# 새 예산을 만들지 않고 사용자가 선택한 기존 계정 전체 예산을 가져옵니다.
# 기본 비활성화입니다. docs/OPERATIONS.md를 읽고 로컬 tfvars에서 활성화하세요.
import {
  for_each = var.enable_cost_budget ? toset(["existing"]) : toset([])
  to       = aws_budgets_budget.monthly[0]
  id       = "${var.expected_account_id}:${var.cost_budget_name}"
}

resource "aws_budgets_budget" "monthly" {
  count = var.enable_cost_budget ? 1 : 0

  account_id   = var.expected_account_id
  name         = var.cost_budget_name
  budget_type  = "COST"
  limit_amount = "5.0" # 기존 월 $5 한도를 유지하며 $1·$3은 별도 절대 금액 알림입니다.
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  # 기존 예산의 비용 기준을 그대로 보존합니다 (크레딧·환불 차감 전 비혼합 비용).
  billing_view_arn = "arn:aws:billing::${var.expected_account_id}:billingview/primary"
  metrics          = ["UnblendedCost"]
  filter_expression {
    not {
      dimensions {
        key    = "RECORD_TYPE"
        values = ["Credit", "Refund"]
      }
    }
  }

  # 계정 전체를 감시합니다. 포트폴리오 태그 필터를 추가하지 않습니다.
  # 서비스·태그 제한은 없습니다. 다른 프로젝트 비용도 포함합니다.
  dynamic "notification" {
    for_each = toset(["1", "3"])
    content {
      comparison_operator        = "GREATER_THAN"
      notification_type          = "ACTUAL"
      threshold                  = tonumber(notification.value)
      threshold_type             = "ABSOLUTE_VALUE"
      subscriber_email_addresses = [var.budget_alert_email]
    }
  }

  # 기존 3개 알림의 조건은 보존합니다. 수신자는 아래 입력 이메일로 통일합니다.
  # 2026-10-25 읽기 전용 확인: 실제 85%/100%, 예상 100% (월 $5 기준).
  dynamic "notification" {
    for_each = {
      actual_85    = { type = "ACTUAL", threshold = 85 }
      actual_100   = { type = "ACTUAL", threshold = 100 }
      forecast_100 = { type = "FORECASTED", threshold = 100 }
    }
    content {
      comparison_operator        = "GREATER_THAN"
      notification_type          = notification.value.type
      threshold                  = notification.value.threshold
      threshold_type             = "PERCENTAGE"
      subscriber_email_addresses = [var.budget_alert_email]
    }
  }

  lifecycle {
    # 활성화 후 끄거나 이름을 바꿔 기존 예산을 삭제·재생성하는 실수를 막습니다.
    prevent_destroy = true
    precondition {
      condition     = var.budget_alert_email != ""
      error_message = "enable_cost_budget = true이면 budget_alert_email에 실제 수신 주소를 입력하세요."
    }
  }
}
