import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Download,
  ExternalLink,
} from 'lucide-react';
import type React from 'react';
import { Badge, Button, Card } from '../common';

interface BillingPlan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isCurrentPlan?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface BillingSectionProps {
  currentPlan?: BillingPlan;
  paymentMethod?: {
    type: 'card';
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  invoices?: Invoice[];
  onUpgrade?: () => void;
  onManagePayment?: () => void;
  disabled?: boolean;
}

const defaultPlan: BillingPlan = {
  name: 'Professional',
  price: 299,
  interval: 'month',
  features: [
    'Unlimited data uploads',
    'Advanced AI insights',
    'Custom dashboards',
    'Priority support',
    'API access',
  ],
  isCurrentPlan: true,
};

const defaultInvoices: Invoice[] = [
  { id: 'INV-001', date: '2024-01-01', amount: 299, status: 'paid' },
  { id: 'INV-002', date: '2024-02-01', amount: 299, status: 'paid' },
  { id: 'INV-003', date: '2024-03-01', amount: 299, status: 'pending' },
];

export const BillingSection: React.FC<BillingSectionProps> = ({
  currentPlan = defaultPlan,
  paymentMethod,
  invoices = defaultInvoices,
  onUpgrade,
  onManagePayment,
  disabled = false,
}) => {
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Current Plan
              </h3>
              <p className="text-sm text-neutral-500">
                Manage your subscription and billing
              </p>
            </div>
          </div>
          {!disabled && (
            <Button variant="secondary" onClick={onUpgrade}>
              Upgrade Plan
            </Button>
          )}
        </div>

        <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-neutral-900">
                  {currentPlan.name}
                </h4>
                {currentPlan.isCurrentPlan && (
                  <Badge variant="primary">Current</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                ${currentPlan.price}
                <span className="text-sm font-normal text-neutral-500">
                  /{currentPlan.interval}
                </span>
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-success-500" />
          </div>

          <div className="mt-4 pt-4 border-t border-primary-100">
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Plan includes:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Payment Method
          </h3>
          {!disabled && (
            <Button variant="ghost" size="sm" onClick={onManagePayment}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage
            </Button>
          )}
        </div>

        {paymentMethod ? (
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg border border-neutral-200">
              <CreditCard className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </p>
              <p className="text-sm text-neutral-500">
                Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-warning-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning-600" />
            <div>
              <p className="font-medium text-warning-900">
                No payment method on file
              </p>
              <p className="text-sm text-warning-700">
                Add a payment method to continue using Vizier after your trial
                ends.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Billing History */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Billing History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                  Invoice
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-neutral-50 last:border-0"
                >
                  <td className="py-3 px-4 font-medium text-neutral-900">
                    {invoice.id}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" disabled={disabled}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            No invoices yet
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default BillingSection;
