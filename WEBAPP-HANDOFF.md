# Daily Utility Cloud Storage web app: what the website now sends

For whoever maintains the web app at **cloud.dailyutilityapps.store**. The
website (this repository) now has a pricing page, plan cards and a sign-in
popup (owner, 23 Nov 2026; STATUS.md section 5zzzzzzzzzzz). The website side
is built; the parts below happen in the web app.

**The flow:** Website → Pricing → choose a plan → Log in / Sign up →
payment or billing details → the web app.

## 1. Links the website sends

Log in, Get started free and every plan button open a popup (Continue with
Google, Continue with Apple, or an email address). Each choice opens the web
app's root with these parameters:

| Parameter | Values | Meaning |
|---|---|---|
| `mode` | `login`, `signup` | Which the visitor chose |
| `provider` | `google`, `apple`, `email` | Start that sign-in straight away |
| `email` | an address | Prefill the email field (only with `provider=email`) |
| `plan` | `plus`, `pro`, `family_max` | The plan chosen (absent = the free tier) |
| `billing` | `monthly`, `yearly` | The billing cycle chosen |
| `currency` | `AED`, `AUD`, `EUR`, `GBP`, `INR`, `SAR`, `USD` | The currency the website showed (only with `plan`); open checkout in it |
| `trial` | `3` | A 3-day free trial was chosen (only with `pro` or `family_max`) |
| `source` | `website` | Came from the website |

Example:

```
https://cloud.dailyutilityapps.store/?mode=signup&provider=google&plan=pro&billing=yearly&currency=AUD&trial=3&source=website
```

The plan and billing map to the web app's own Stripe products:
`{billing}_{plan}` (`plan=pro&billing=yearly` → `yearly_pro`).

**Today** the web app ignores these and shows its normal sign-in page, so
nothing breaks; visitors pick their plan again in Premium.

**Needed:** keep the parameters through sign-in, then:

- no `plan`: open the app (free tier, 10GB);
- `plan` without `trial`: go straight to payment for that plan, cycle and
  currency;
- `plan` with `trial=3`: billing setup for that plan's 3-day trial.

## 2. The 3-day free trial (new)

The website offers a 3-day free trial on **Pro** and **Family Max** (owner,
23 Nov). The web app has no trial yet. To honour it:

- collect a payment method **before** the trial starts (Stripe Checkout:
  `mode: subscription`, `subscription_data.trial_period_days: 3`,
  `payment_method_collection: always`);
- start the trial only once billing setup succeeds, and activate paid plans
  only after a verified payment (webhooks `checkout.session.completed`,
  `invoice.paid`), never on the redirect alone;
- show before confirming: the trial length and end date, the price and
  billing frequency, that it renews automatically, the amount charged
  after the trial and when, and how to cancel.

## 3. Currency

The website shows the visitor's currency: their country (get.geojs.io)
mapped to a currency Daily Utility sells in, US dollars otherwise, with a
"Pay in" picker. The web app currently starts in US dollars. It should open
checkout in `currency` when it is sent.

## 4. Prices

The website's prices are the web app's own, read on 23 Nov 2026 from
`getproducts` and kept in `_data/plans.yml`. If a price changes in Stripe,
change it there too.

## 5. Tracking

The website sends Google tag events (Ads tag AW-18499228710) when a visitor
acts: `select_plan`, `select_billing`, `select_currency`, `sign_up_start`,
`login_start`, `sign_up_continue`, `login_continue`, `begin_trial`,
`begin_checkout`, `view_promotion`. These are intentions. The web app should
report the results after they happen: `sign_up`, `trial_started`,
`purchase` (value, currency, transaction id) and `upgrade`.
