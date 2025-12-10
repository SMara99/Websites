# Subscription Tiers

## Overview
The Websites platform offers three subscription tiers that provide unified access to all applications. A single subscription controls access across House Planner, Habit Tracker, and Personal Website features.

---

## Available Plans

### 🆓 Free Plan
**Price**: $0/month

**Access**:
- ✅ All three applications (limited features)
- ✅ Basic functionality

**Limits**:
- **House Planner**: 3 rooms, 10 maintenance items
- **Habit Tracker**: 5 habits
- **Personal Website**: Basic features only

**Best For**: Users trying out the platform or with minimal needs

---

### 📦 Basic Plan
**Price**: $4.99/month or $49.99/year (2 months free)

**Access**:
- ✅ All three applications (full features)
- ✅ Priority support

**Limits**:
- **House Planner**: 10 rooms, 50 maintenance items
- **Habit Tracker**: 20 habits
- **Personal Website**: All features

**Best For**: Regular users who want full functionality with reasonable limits

---

### ⭐ Premium Plan
**Price**: $9.99/month or $99.99/year (2 months free)

**Access**:
- ✅ All three applications (unlimited)
- ✅ Priority support
- ✅ Early access to new features
- ✅ Advanced analytics

**Limits**:
- **House Planner**: Unlimited rooms and items
- **Habit Tracker**: Unlimited habits
- **Personal Website**: Unlimited everything

**Best For**: Power users and professionals who need unlimited access

---

## Feature Comparison

| Feature | Free | Basic | Premium |
|---------|------|-------|---------|
| **House Planner** | | | |
| Max Rooms | 3 | 10 | ∞ |
| Max Maintenance Items | 10 | 50 | ∞ |
| Task Priorities | ✅ | ✅ | ✅ |
| Custom Frequencies | ❌ | ✅ | ✅ |
| Task History | ❌ | ✅ | ✅ |
| **Habit Tracker** | | | |
| Max Habits | 5 | 20 | ∞ |
| Streak Tracking | ✅ | ✅ | ✅ |
| Habit Categories | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ |
| **Personal Website** | | | |
| Basic Features | ✅ | ✅ | ✅ |
| Custom Themes | ❌ | ✅ | ✅ |
| Advanced Schedule | ❌ | ✅ | ✅ |
| Portfolio Projects | 3 | 10 | ∞ |
| **General** | | | |
| Multi-device Sync | ✅ | ✅ | ✅ |
| Data Export | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| Early Access Features | ❌ | ❌ | ✅ |

---

## Subscription Model

### Unified Access
- **One Account**: Single login for all apps
- **One Subscription**: Controls access to all apps simultaneously
- **Flexible**: Choose apps to use, skip others

### Access Patterns

**Scenario 1: Use All Apps**
- Subscribe to any plan
- Access house-planner, habit-tracker, and personal-website
- Feature limits apply per app based on plan

**Scenario 2: Use Some Apps**
- Subscribe to any plan
- Use only the apps you need
- Still have access to all apps
- Limits still apply even if unused

**Scenario 3: Free Tier**
- No payment required
- Limited access to all apps
- Can upgrade anytime

---

## Plan Selection Guide

### Choose **Free** if you:
- Want to try the platform
- Have minimal tracking needs
- Don't need advanced features
- Manage a small household (<3 rooms)
- Track just a few habits (<5)

### Choose **Basic** if you:
- Use the apps regularly
- Need full feature access
- Have a medium-sized household (3-10 rooms)
- Track multiple habits (5-20)
- Want priority support

### Choose **Premium** if you:
- Use the platform extensively
- Manage large or multiple households
- Track many habits (20+)
- Need advanced analytics
- Want unlimited everything
- Want early access to new features

---

## Upgrade/Downgrade

### Upgrading
- Immediate access to new limits
- Prorated billing for current period
- No data loss

### Downgrading
- Takes effect at end of billing period
- Data preserved but read-only if over limit
- Can re-upgrade anytime

### Canceling
- Access continues until period ends
- Automatically moves to Free plan
- Data preserved within Free limits
- Items over limit become read-only

---

## Custom Plans

For teams, families, or enterprises with special needs:
- Custom feature limits
- Custom pricing
- Multi-user households
- Shared subscriptions
- Contact: support@websites-platform.example

---

## Payment Options

- **Monthly**: Pay-as-you-go, cancel anytime
- **Yearly**: Save 17% (2 months free)
- **Payment Methods**: Credit/Debit cards, PayPal
- **Currency**: USD (other currencies coming soon)
- **Billing**: Automatic renewal, cancel anytime

---

## Trial Periods

- **Free Plan**: No trial needed (already free)
- **Basic Plan**: 14-day free trial
- **Premium Plan**: 14-day free trial
- **No Credit Card**: Required for trial (may change)
- **Cancel Anytime**: During trial, no charge

---

## Implementation Notes (For Development)

### Database Fields
- Limits stored in JSONB for flexibility
- Example: `{"max_rooms": 10, "max_items": 50}`
- `-1` means unlimited
- `null` means feature not available

### Access Checking
```javascript
// Pseudo-code for access check
async function canAddRoom(userId) {
  const subscription = await getSubscription(userId);
  const limits = await getAppLimits(subscription.plan_id, 'house-planner');
  const currentRooms = await countUserRooms(userId);
  
  if (limits.max_rooms === -1) return true; // unlimited
  return currentRooms < limits.max_rooms;
}
```

### Feature Flags
- Use `feature_limits` JSONB to control features
- Check both plan limits and user overrides
- Cache subscription data for performance

---

## FAQ

**Q: Can I subscribe to just one app?**
A: No, subscriptions are platform-wide. However, you're free to use only the apps you want.

**Q: What happens to my data if I downgrade?**
A: All data is preserved. Items beyond your new limit become read-only until you delete some or upgrade.

**Q: Can I share my subscription?**
A: Not currently. Each user needs their own subscription. Family plans coming soon.

**Q: Do prices include taxes?**
A: Prices shown are before applicable taxes, which vary by location.

**Q: Can I get a refund?**
A: Yes, within 30 days of purchase for monthly plans, or pro-rated for yearly plans.
