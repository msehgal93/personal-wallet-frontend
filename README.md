# Wallet Management Service – Frontend Specifications

**Goal:**  
Create high level specifications for Frontend of a Wallet Management Service based on the given problem statement.

---

## Technology Choices
- React 19 – modern UI framework
- Tailwind CSS – rapid styling
- Static hosting – low cost, fast delivery

---

## Architecture

### Page 1 – Wallet Dashboard
- Wallet initialization
    a. initially if no wallet is configured, show a simple input field asking for Username, optional initial balance field and Submit button.
    b. When the user clicks the button, use the data provided to initialize a new wallet
- Wallet summary
    a. Save the wallet id in local storage which can be used next time if the user revisits the page.
    b. Use the wallet id to show the wallet balance and name.
- Credit / Debit form - Once we have the wallet initialized, show a section for doing transactions
1. An input field for transaction amount
2. A toggle for indicating whether its a CREDIT or DEBIT transaction
3. And a submit button to execute the transaction
- Once the transaction is completed, the wallet balance should automatically update to reflect the transaction
- Show a link in page 1 to visit page 2, Wallet transactions


### Page 2 – Transactions
- Paginated table: a table of all the transactions available for the wallet, should support Pagination of data
- Ability to sort transactions by date and amount
- Export CSV file of all transactions available

---

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for static hosting.
