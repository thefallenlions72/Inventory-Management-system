// --- Global State ---
let billItems = [];

// --- Page Navigation Logic ---
function showPage(pageId, element) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// --- Billing System Logic ---
function addToBill() {
    const id = document.getElementById('b-id').value.trim();
    const name = document.getElementById('b-name').value.trim();
    const qty = parseInt(document.getElementById('b-qty').value) || 0;
    const price = parseFloat(document.getElementById('b-price').value) || 0;

    if (!id || !name || qty <= 0 || price <= 0) {
        alert('Please fill all billing fields correctly');
        return;
    }

    const total = qty * price;
    billItems.push({id, name, qty, price, total});

    updateTable();
    updateGrandTotal();

    // Clear form
    document.getElementById('b-id').value = '';
    document.getElementById('b-name').value = '';
    document.getElementById('b-qty').value = 1;
    document.getElementById('b-price').value = '';
}

function updateTable() {
    const tbody = document.getElementById('bill-body');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 
    billItems.forEach((item) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
        `;
    });
}

function updateGrandTotal() {
    const grandTotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const totalDisplay = document.getElementById('grand-total');
    if (totalDisplay) {
        totalDisplay.textContent = grandTotal.toFixed(2);
    }
    return grandTotal;
}

function generateBill() {
    if (billItems.length === 0) {
        alert('No items in bill');
        return;
    }
    
    const grandTotal = updateGrandTotal();
    const billHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Customer Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                h1, h2 { text-align: center; color: #333; }
                p { margin: 10px 0; padding: 8px; border-bottom: 1px solid #eee; }
                .total { font-size: 24px; font-weight: bold; color: #28a745; }
            </style>
        </head>
        <body>
            <h1>Customer Invoice</h1>
            <div>
                ${billItems.map(item => `
                    <p>
                        <strong>${item.name}</strong> (ID: ${item.id})<br>
                        Qty: ${item.qty} × $${item.price.toFixed(2)} = <strong>$${item.total.toFixed(2)}</strong>
                    </p>
                `).join('')}
            </div>
            <h2 class="total">Total: $${grandTotal.toFixed(2)}</h2>
            <p style="text-align: center; font-size: 12px; color: #666;">
                Invoice generated on ${new Date().toLocaleDateString()}
            </p>
        </body>
        </html>
    `;
    
    const blob = new Blob([billHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // FIXED: Added backticks for string interpolation
    a.download = `invoice_${new Date().toISOString().slice(0,10)}.html`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Supplier Management Logic ---
function addSupplier() {
    const name = document.getElementById('s-name').value;
    const email = document.getElementById('s-email').value;
    const contact = document.getElementById('s-contact').value;
    const address = document.getElementById('s-address').value;
    const date = document.getElementById('s-date').value;

    if (name === "" || date === "") {
        alert("Please fill in the Supplier Name and Date of Purchase.");
        return;
    }

    const tableBody = document.getElementById('supplier-body');
    const row = document.createElement('tr');
    // FIXED: Added backticks around the HTML string
    row.innerHTML = `<td>${name}</td><td>${email}</td><td>${contact}</td><td>${address}</td><td>${date}</td>`;
    tableBody.appendChild(row);

    ['s-name', 's-email', 's-contact', 's-address', 's-date'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

// --- Inventory Management Logic ---
function addItem() {
    const id = document.getElementById('p-id').value;
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-category').value;
    const qty = document.getElementById('p-qty').value;
    const price = document.getElementById('p-price').value;
    const supplier = document.getElementById('p-supplier').value;
    const arrival = document.getElementById('p-arrival').value;
    const expiry = document.getElementById('p-expiry').value;
    
    if(!name) { alert("Product name is required"); return; }

    const tableBody = document.getElementById('inventory-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${id}</td><td>${name}</td><td>${cat}</td><td>${qty}</td>
        <td>$${price}</td><td>${supplier}</td><td>${arrival}</td><td>${expiry}</td>
    `;
    tableBody.appendChild(row);
}

// --- Initialize Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    const billingInputs = ['b-id', 'b-name', 'b-qty', 'b-price'];
    billingInputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Good practice to prevent form submission
                    addToBill();
                }
            });
        }
    });
});