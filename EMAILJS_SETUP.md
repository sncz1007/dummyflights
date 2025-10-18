# EmailJS Configuration Guide

This guide will help you set up the booking notification email template in EmailJS.

## Prerequisites

You should already have:
- EmailJS account created at https://dashboard.emailjs.com/
- A service configured (Gmail, Outlook, etc.)
- `VITE_EMAILJS_SERVICE_ID` and `VITE_EMAILJS_PUBLIC_KEY` already set

## Step 1: Create New Email Template

1. Go to https://dashboard.emailjs.com/
2. Click on **Email Templates** in the left sidebar
3. Click **Create New Template**
4. Give it a name: "Booking Notification" (or any name you prefer)
5. Copy the **Template ID** and save it as `VITE_EMAILJS_BOOKING_TEMPLATE_ID` in your environment variables

## Step 2: Configure Template Content

In the template editor, use the following configuration:

### Template Name
```
Booking Notification
```

### Subject Line
```
New Flight Booking - {{flight_number}} - {{customer_name}}
```

### Email Body (HTML)

Copy and paste this HTML template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #dc2626;
            margin-top: 0;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 10px;
        }
        h2 {
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-top: 25px;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-left: 4px solid #dc2626;
            border-radius: 4px;
        }
        .info-row {
            margin: 8px 0;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #4b5563;
            display: inline-block;
            width: 150px;
        }
        .value {
            color: #1f2937;
        }
        .price-section {
            background: #fef2f2;
            border-left-color: #16a34a;
        }
        .passenger-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        }
        .highlight {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛫 New Flight Booking</h1>
        
        <div class="section">
            <div class="info-row">
                <span class="label">Booking Date:</span>
                <span class="value">{{booking_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Language:</span>
                <span class="value">{{language}}</span>
            </div>
        </div>

        <h2>✈️ Flight Information</h2>
        <div class="section">
            <div class="info-row">
                <span class="label">Airline:</span>
                <span class="value highlight">{{airline}}</span>
            </div>
            <div class="info-row">
                <span class="label">Flight Number:</span>
                <span class="value highlight">{{flight_number}}</span>
            </div>
            <div class="info-row">
                <span class="label">Route:</span>
                <span class="value">{{from_airport}} → {{to_airport}}</span>
            </div>
            <div class="info-row">
                <span class="label">Departure Date:</span>
                <span class="value">{{departure_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Return Date:</span>
                <span class="value">{{return_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Trip Type:</span>
                <span class="value">{{trip_type}}</span>
            </div>
            <div class="info-row">
                <span class="label">Class:</span>
                <span class="value">{{flight_class}}</span>
            </div>
            <div class="info-row">
                <span class="label">Total Passengers:</span>
                <span class="value">{{passengers_count}}</span>
            </div>
        </div>

        <h2>👤 Primary Passenger (Customer)</h2>
        <div class="section">
            <div class="info-row">
                <span class="label">Full Name:</span>
                <span class="value">{{customer_name}}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{customer_email}}</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{customer_phone}}</span>
            </div>
            <div class="info-row">
                <span class="label">Date of Birth:</span>
                <span class="value">{{customer_dob}}</span>
            </div>
        </div>

        <h2>👥 Additional Passengers</h2>
        <div class="section">
            <pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">{{additional_passengers}}</pre>
        </div>

        <h2>💰 Pricing Details</h2>
        <div class="section price-section">
            <div class="info-row">
                <span class="label">Original Price:</span>
                <span class="value" style="text-decoration: line-through; color: #9ca3af;">{{original_price}}</span>
            </div>
            <div class="info-row">
                <span class="label">Discount:</span>
                <span class="value" style="color: #16a34a; font-weight: bold;">{{discount}}</span>
            </div>
            <div class="info-row">
                <span class="label">Total Price:</span>
                <span class="value" style="color: #16a34a; font-size: 20px; font-weight: bold;">{{total_price}}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>SkyBudgetFly</strong> - Booking Notification System</p>
            <p>This is an automated notification. Please process this booking and purchase tickets manually.</p>
        </div>
    </div>
</body>
</html>
```

## Step 3: Test Template Variables

Make sure the following variables are present in your template (EmailJS will show them in the right sidebar):

### Flight Information
- `airline`
- `flight_number`
- `from_airport`
- `to_airport`
- `departure_date`
- `return_date`
- `trip_type`
- `flight_class`
- `passengers_count`
- `passengers_count_total`

### Customer Information
- `customer_name`
- `customer_email`
- `customer_phone`
- `customer_dob`

### Additional Passengers
- `additional_passengers` (formatted list)

### Pricing
- `total_price`
- `original_price`
- `discount`

### Metadata
- `language`
- `booking_date`

## Step 4: Save and Test

1. Click **Save** in the template editor
2. Use the **Test** button in EmailJS to send a test email
3. Make sure you receive the email correctly formatted

## Step 5: Environment Configuration

Add the new template ID to your environment variables:

```bash
VITE_EMAILJS_BOOKING_TEMPLATE_ID=your_template_id_here
```

## When Does the Email Send?

The booking notification email is sent **immediately** when a customer:
1. Fills out their contact information
2. Adds additional passenger details (if applicable)
3. Clicks "Continue to Payment"

The email is sent **BEFORE** the payment is completed, so you receive the booking details as soon as the customer commits to paying.

## Email Content Includes

- Complete flight details (route, dates, class, airline, flight number)
- Primary passenger information (name, email, phone, DOB)
- All additional passengers with their names and DOB
- Pricing breakdown (original price, discount, final price)
- Language preference
- Timestamp of booking

## Notes

- The email will NOT block the checkout process if it fails to send
- Check your console logs for any email sending errors
- Make sure your EmailJS service has sufficient quota
- The email is sent to the address configured in your EmailJS service (should be skybudgetfly@gmail.com)
