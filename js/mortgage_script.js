document.addEventListener('DOMContentLoaded', () => {
    const mortgageForm = document.getElementById('mortgage-form');

    const propertyPriceInput = document.getElementById('property-price');
    const propertyPriceRange = document.getElementById('property-price-range');
    const propertyPriceValueSpan = propertyPriceRange.nextElementSibling;

    const downPaymentInput = document.getElementById('initial-capital'); 
    const downPaymentRange = document.getElementById('initial-capital-range'); 
    const downPaymentValueSpan = downPaymentRange.nextElementSibling;

    const interestRateInput = document.getElementById('interest-rate');
    const interestRateRange = document.getElementById('interest-rate-range');
    const interestRateValueSpan = interestRateRange.nextElementSibling;

    const amortizationPeriodInput = document.getElementById('amortization-period');
    const amortizationUnitSelect = document.getElementById('amortization-unit');
    const amortizationPeriodRange = document.getElementById('amortization-period-range');
    const amortizationPeriodValueSpan = amortizationPeriodRange.nextElementSibling;

    const hasSecondaryInterestCheckbox = document.getElementById('has-secondary-interest');
    const secondaryInterestBlock = document.getElementById('secondary-interest-block');
    const changePeriodBlock = document.getElementById('change-period-block');

    const secondaryInterestRateInput = document.getElementById('secondary-interest-rate');
    const secondaryInterestRateRange = document.getElementById('secondary-interest-rate-range');
    const secondaryInterestRateValueSpan = secondaryInterestRateRange.nextElementSibling;

    const changePeriodInput = document.getElementById('change-period');
    const changeUnitSelect = document.getElementById('change-unit');
    const changePeriodRange = document.getElementById('change-period-range');
    const changePeriodValueSpan = changePeriodRange.nextElementSibling;

    const monthlyPaymentSpan = document.getElementById('monthly-payment');
    const totalInterestSpan = document.getElementById('total-interest');
    const totalCostSpan = document.getElementById('total-cost');

    const chimneyArea = document.getElementById('chimney-area'); 

    function syncSlider(input, range, valueSpan, unit = '', precision = 0) {
        if (!input || !range || !valueSpan) {
            console.error('Error en syncSlider: Uno o más elementos del DOM no fueron encontrados.', {input, range, valueSpan});
            return; 
        }
        
        const updateValueDisplay = (val) => {
             valueSpan.textContent = parseFloat(val).toFixed(precision) + unit;
        };

        input.addEventListener('input', () => {
            let val = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (isNaN(val)) val = min !== undefined ? min : 0;
            if (min !== undefined && val < min) val = min;
            if (max !== undefined && val > max) val = max;
            
            input.value = parseFloat(val).toFixed(precision);
            range.value = parseFloat(input.value); 
            updateValueDisplay(input.value);
        });
        range.addEventListener('input', () => {
            input.value = parseFloat(range.value).toFixed(precision);
            updateValueDisplay(range.value);
        });
        
        let initialSyncValue = range.value; 
        if (input.value && !isNaN(parseFloat(input.value))) { 
            initialSyncValue = input.value;
        }
        
        let valToSync = parseFloat(initialSyncValue);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);

        if (isNaN(valToSync)) valToSync = min !== undefined ? min : 0;
        if (min !== undefined && valToSync < min) valToSync = min;
        if (max !== undefined && valToSync > max) valToSync = max;

        input.value = parseFloat(valToSync).toFixed(precision);
        range.value = parseFloat(valToSync).toFixed(precision); 
        updateValueDisplay(input.value);
    }
    
    function syncFieldsWithSelectAndRange(inputEl, rangeEl, valueSpanEl, unitSelectEl) {
        if (!inputEl || !rangeEl || !valueSpanEl || !unitSelectEl) {
            console.error('Error en syncFieldsWithSelectAndRange: Uno o más elementos del DOM no fueron encontrados.');
            return;
        }
       
        const updateDisplayAndRange = () => {
            let val = parseFloat(inputEl.value);
            const min = parseFloat(inputEl.min);
            const max = parseFloat(inputEl.max); 

            if (isNaN(val)) val = min !== undefined ? min : 1;
            if (min !== undefined && val < min) val = min;
            if (max !== undefined && val > max) val = max;
            
            inputEl.value = val; 
            rangeEl.value = val; 

            const unitText = unitSelectEl.options[unitSelectEl.selectedIndex].text;
            valueSpanEl.textContent = `${val} ${unitText}`;
        };

        const updateDisplayAndInput = () => {
            inputEl.value = rangeEl.value; 
            const unitText = unitSelectEl.options[unitSelectEl.selectedIndex].text;
            valueSpanEl.textContent = `${rangeEl.value} ${unitText}`;
        };
        
        inputEl.addEventListener('input', updateDisplayAndRange);
        rangeEl.addEventListener('input', updateDisplayAndInput);
        unitSelectEl.addEventListener('change', updateDisplayAndRange); 

        let initialSyncValueText = rangeEl.value;
        if (inputEl.value && !isNaN(parseFloat(inputEl.value))) {
            initialSyncValueText = inputEl.value;
        }
        
        let valToSyncNum = parseFloat(initialSyncValueText);
        const min = parseFloat(inputEl.min);
        const max = parseFloat(inputEl.max);

        if (isNaN(valToSyncNum)) valToSyncNum = min !== undefined ? min : 1;
        if (min !== undefined && valToSyncNum < min) valToSyncNum = min;
        if (max !== undefined && valToSyncNum > max) valToSyncNum = max;
        
        inputEl.value = valToSyncNum;
        inputEl.dispatchEvent(new Event('input')); // Trigger initial sync
    }

    syncSlider(propertyPriceInput, propertyPriceRange, propertyPriceValueSpan, ' €', 0); 
    syncSlider(downPaymentInput, downPaymentRange, downPaymentValueSpan, ' €'); 
    syncSlider(interestRateInput, interestRateRange, interestRateValueSpan, ' %', 2);
    syncSlider(secondaryInterestRateInput, secondaryInterestRateRange, secondaryInterestRateValueSpan, ' %', 2);
    
    syncFieldsWithSelectAndRange(amortizationPeriodInput, amortizationPeriodRange, amortizationPeriodValueSpan, amortizationUnitSelect);
    syncFieldsWithSelectAndRange(changePeriodInput, changePeriodRange, changePeriodValueSpan, changeUnitSelect);
    
    hasSecondaryInterestCheckbox.addEventListener('change', () => {
        if (hasSecondaryInterestCheckbox.checked) {
            secondaryInterestBlock.style.display = 'block';
            changePeriodBlock.style.display = 'block';
            // Re-initialize sliders if they were hidden
            if (secondaryInterestRateInput && secondaryInterestRateRange && secondaryInterestRateValueSpan) {
                 syncSlider(secondaryInterestRateInput, secondaryInterestRateRange, secondaryInterestRateValueSpan, ' %', 2);
            }
            if (changePeriodInput && changePeriodRange && changePeriodValueSpan && changeUnitSelect) {
                 syncFieldsWithSelectAndRange(changePeriodInput, changePeriodRange, changePeriodValueSpan, changeUnitSelect);
            }
        } else {
            secondaryInterestBlock.style.display = 'none';
            changePeriodBlock.style.display = 'none';
        }
    });
    hasSecondaryInterestCheckbox.dispatchEvent(new Event('change')); // Initial setup

    mortgageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const propertyPrice = parseFloat(propertyPriceInput.value);
        const downPayment = parseFloat(downPaymentInput.value); 
        
        const P = propertyPrice - downPayment;

        const i_annual = parseFloat(interestRateInput.value) / 100;
        let n_total_months;

        if (amortizationUnitSelect.value === 'years') {
            n_total_months = parseFloat(amortizationPeriodInput.value) * 12;
        } else {
            n_total_months = parseFloat(amortizationPeriodInput.value);
        }

        
        if (isNaN(propertyPrice) || propertyPrice <= 0) {
            alert('Por favor, introduce un precio de inmueble válido.');
            propertyPriceInput.focus();
            return;
        }
        if (isNaN(downPayment) || downPayment < 0) {
            alert('Por favor, introduce una entrada aportada válida (0 o mayor).');
            downPaymentInput.focus();
            return;
        }
        if (downPayment > propertyPrice) {
            alert('La entrada aportada no puede ser mayor que el precio del inmueble.');
            downPaymentInput.focus();
            return;
        }
        
        if (P <= 0) { // If down payment covers the whole price or more
            // Clarification: if P < 0, it means downPayment > propertyPrice, already handled.
            // So this handles P === 0.
            if (P < 0) { // Should not happen due to above check, but as a safeguard.
                 alert('Error en el cálculo del préstamo. Revise el precio del inmueble y la entrada.');
                 return;
            }
            // If P === 0, it means the property is fully paid by the down payment.
            // No loan needed.
            monthlyPaymentSpan.innerHTML = '0.00&nbsp;€';
            totalInterestSpan.innerHTML = '0.00&nbsp;€';
            totalCostSpan.innerHTML = '0.00&nbsp;€'; // Cost of loan is 0. Total cost of property is propertyPrice.
            if (chimneyArea) createHeartExplosion(); // Or maybe not if P=0
            return; 
        }


        if (isNaN(i_annual) || i_annual < 0) { // Allow 0 interest
             alert('Por favor, introduce un tipo de interés anual válido (0 o mayor).');
            interestRateInput.focus();
            return;
        }
         if (isNaN(n_total_months) || n_total_months <= 0) {
            alert('Por favor, introduce un plazo de amortización válido.');
            amortizationPeriodInput.focus();
            return;
        }

        let monthlyPayment = 0;
        let totalInterest = 0;
        let totalCost = 0; 

        if (P === 0) { // This case is handled above, but good to be explicit
            monthlyPayment = 0;
            totalInterest = 0;
            totalCost = 0; 
        } else if (!hasSecondaryInterestCheckbox.checked) { 
            const i_monthly = i_annual / 12;
            if (i_annual === 0) { // 0% interest rate
                monthlyPayment = P / n_total_months;
                totalInterest = 0;
            } else {
                monthlyPayment = P * (i_monthly * Math.pow(1 + i_monthly, n_total_months)) / (Math.pow(1 + i_monthly, n_total_months) - 1);
                totalInterest = (monthlyPayment * n_total_months) - P;
            }
            totalCost = P + totalInterest;
        } else { // Has secondary interest period
            const i1_annual = parseFloat(interestRateInput.value) / 100; 
            const i2_annual = parseFloat(secondaryInterestRateInput.value) / 100;
            let k_months; // months for the first interest period
            if (changeUnitSelect.value === 'years') {
                k_months = parseFloat(changePeriodInput.value) * 12;
            } else {
                k_months = parseFloat(changePeriodInput.value);
            }

            if (isNaN(i2_annual) || i2_annual < 0) { // Allow 0 interest
                 alert('Por favor, introduce un tipo de interés posterior válido.');
                 secondaryInterestRateInput.focus(); return;
            }
            if (isNaN(k_months) || k_months <= 0 || k_months >= n_total_months) {
                alert('El periodo de cambio de tipo debe ser mayor que 0 y menor que el plazo total de amortización.');
                changePeriodInput.focus(); return;
            }
            
            const i1_monthly = i1_annual / 12;
            const i2_monthly = i2_annual / 12;
            let M_temp_for_first_period_calc = 0; // This is the monthly payment if the *first* interest rate applied for the whole loan
            
            // Calculate a theoretical monthly payment as if the first interest rate applied for the whole period.
            // This is a common way to start a two-part loan calculation (e.g., French amortization system)
            // However, this M_temp is often just used to pay down the principal during the first period.
            // The question is if the monthly payment is fixed for the first k_months, or if it changes.
            // The code calculates M_temp and then calls it monthlyPayment, implying it's fixed for first period.
            
            if (i1_annual === 0) { 
                // If first rate is 0, the monthly payment for that period is principal divided by total months.
                // This might not be standard; usually, payment recalculates.
                // For simplicity, let's assume the problem intends a flat payment for the first period based on i1 for n_total_months.
                M_temp_for_first_period_calc = P / n_total_months; 
            } else { 
                // Standard calculation for a loan payment if i1_annual applied for n_total_months
                M_temp_for_first_period_calc = P * (i1_monthly * Math.pow(1 + i1_monthly, n_total_months)) / (Math.pow(1 + i1_monthly, n_total_months) - 1); 
            }
            monthlyPayment = M_temp_for_first_period_calc; // This is the payment for the first k_months
            
            let outstandingBalance = P; 
            totalInterest = 0; 

            // First period (k_months)
            for (let month = 1; month <= k_months; month++) {
                if (outstandingBalance <= 0.005) { // Effectively paid off
                    outstandingBalance = 0; 
                    break;
                }
                let currentPaymentForLoop = monthlyPayment; // Use the calculated fixed monthly payment
                let interestForMonth = outstandingBalance * i1_monthly;
                let principalPayment = currentPaymentForLoop - interestForMonth;

                // Adjust if payment overshoots
                if (principalPayment > outstandingBalance) { 
                    principalPayment = outstandingBalance;
                    // currentPaymentForLoop = outstandingBalance + interestForMonth; // Actual payment would be less
                }
                 if (outstandingBalance - principalPayment < 0 && outstandingBalance > 0) { // Defensive
                    principalPayment = outstandingBalance;
                }
                
                outstandingBalance -= principalPayment;
                totalInterest += interestForMonth;
            }

            // Second period (remainingMonths)
            const remainingMonths = n_total_months - k_months;
            if (outstandingBalance > 0.005 && remainingMonths > 0) {
                let M2 = 0; // New monthly payment for the second period
                if (i2_annual === 0) { // 0% interest for second period
                    M2 = outstandingBalance / remainingMonths; 
                } else { 
                    M2 = outstandingBalance * (i2_monthly * Math.pow(1 + i2_monthly, remainingMonths)) / (Math.pow(1 + i2_monthly, remainingMonths) - 1); 
                }
                // The `monthlyPayment` variable displayed is the one from the *first* period.
                // The actual payments in the second period will be M2. This is a common way to represent mixed-rate loans.
                // The `totalInterest` calculation correctly sums interest from both periods using respective payments.
                
                for (let month = 1; month <= remainingMonths; month++) {
                     if (outstandingBalance <= 0.005) {
                        outstandingBalance = 0;
                        break;
                    }
                    let currentPaymentForLoop = M2; // Use the new monthly payment M2
                    let interestForMonth = outstandingBalance * i2_monthly;
                    let principalPayment = currentPaymentForLoop - interestForMonth;

                    if (principalPayment > outstandingBalance) {
                       principalPayment = outstandingBalance;
                       // currentPaymentForLoop = outstandingBalance + interestForMonth;
                    }
                     if (outstandingBalance - principalPayment < 0 && outstandingBalance > 0) { // Defensive
                        principalPayment = outstandingBalance;
                    }

                    outstandingBalance -= principalPayment;
                    totalInterest += interestForMonth;
                }
            }
             totalCost = P + totalInterest; 
        }

        monthlyPaymentSpan.innerHTML = (monthlyPayment >= 0 ? monthlyPayment.toFixed(2) : '0.00') + '&nbsp;€';
        totalInterestSpan.innerHTML = (totalInterest >= 0 ? totalInterest.toFixed(2) : '0.00') + '&nbsp;€';
        totalCostSpan.innerHTML = (totalCost >= 0 ? totalCost.toFixed(2) : '0.00') + '&nbsp;€';
    
        if (P > 0 && chimneyArea) { 
             createHeartExplosion(); 
        }
    });

    function createHeartExplosion() {
        if (!chimneyArea) return; 

        const numHearts = 10;
        // Clear previous hearts
        while (chimneyArea.firstChild) {
            chimneyArea.removeChild(chimneyArea.firstChild);
        }

        for (let i = 0; i < numHearts; i++) {
            setTimeout(() => {
                if (!chimneyArea) return; // Check again in case element is removed
                const heart = document.createElement('div');
                heart.classList.add('heart-particle');
                
                // Randomize horizontal explosion direction slightly more
                const randomXPercentage = (Math.random() - 0.5) * 80; // -40% to +40%
                heart.style.setProperty('--random-x', `${randomXPercentage}%`);
                
                // Start hearts more centered above the chimney
                heart.style.left = `${20 + Math.random() * 60}%`; // More spread initially
                heart.style.top = `${50 + Math.random() * 40}%`;   // Start lower, appear to come from chimney

                chimneyArea.appendChild(heart);

                // Remove heart after animation to prevent buildup
                heart.addEventListener('animationend', () => {
                    if(heart && heart.parentNode === chimneyArea) { // Check if still child of chimneyArea
                         heart.remove();
                    }
                }, { once: true }); // Use once: true for automatic listener removal
            }, i * 120); // Stagger hearts
        }
    }
});