class BankAccount {
    constructor(firstName, lastName, middleName, accountType, balance) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.accountType = accountType;
        this.balance = balance;
        this.status = balance >= 100 ? "Opened" : "Freeze";
    }

    canWithdraw() {
        return this.status === "Opened";
    }

    updateStatus() {
        this.status = this.balance < 0 ? "Freeze" : "Opened";
    }

    deposit(amount) {
        this.balance += amount;
        this.updateStatus();
    }

    applyPenalty() {
        this.balance -= 35;
        this.updateStatus();
    }

    withdraw(amount) {
        if (this.canWithdraw()) {
            this.balance -= amount;

            // Apply fee and freeze account if overdrawn
            if (this.balance < 0) {
                this.applyPenalty();
            }
        } else {
            console.log("Cannot complete transaction: ACCOUNT FROZEN");
        }
    }

    transfer(amount, toAccount) {
        if (this.canWithdraw()) {
            this.withdraw(amount);
            toAccount.deposit(amount);
        } else {
            console.log("Cannot complete transaction: ACCOUNT FROZEN");
        }
    }
}
