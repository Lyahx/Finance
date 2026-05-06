"use client";

import React from 'react';
import BalanceCard from "@/components/dashboard/BalanceCard";
import TransactionList from "@/components/dashboard/TransactionList";
import InsightCard from "@/components/dashboard/InsightCard";
import ExchangeTracker from "@/components/dashboard/ExchangeTracker";
import BudgetProgressCard from "@/components/dashboard/BudgetProgressCard";
import UpcomingSubscriptionsCard from "@/components/dashboard/UpcomingSubscriptionsCard";
import QuickContactsCard from "@/components/dashboard/QuickContactsCard";
import RiskSummaryCard from "@/components/dashboard/RiskSummaryCard";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main column */}
      <div className="lg:col-span-8 space-y-6">
        <BalanceCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BudgetProgressCard />
          <RiskSummaryCard />
        </div>

        <TransactionList />
      </div>

      {/* Right column */}
      <div className="lg:col-span-4 space-y-6">
        <InsightCard />
        <UpcomingSubscriptionsCard />
        <QuickContactsCard />
        <ExchangeTracker />
      </div>
    </div>
  );
}
