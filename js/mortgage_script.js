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
        inputEl.dispatchEvent(new Event('input'));
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
    hasSecondaryInterestCheckbox.dispatchEvent(new Event('change')); 

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
        
        if (P <= 0) { 
           
            if (P < 0) { 
                 alert('Error en el cálculo del préstamo. Revise el precio del inmueble y la entrada.');
                 return;
            }
            
            monthlyPaymentSpan.innerHTML = '0.00&nbsp;€';
            totalInterestSpan.innerHTML = '0.00&nbsp;€';
            totalCostSpan.innerHTML = '0.00&nbsp;€'; 
            if (chimneyArea) createHeartExplosion(); 
            return; 
        }


        if (isNaN(i_annual) || i_annual < 0) { 
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

        if (P === 0) { 
            monthlyPayment = 0;
            totalInterest = 0;
            totalCost = 0; 
        } else if (!hasSecondaryInterestCheckbox.checked) { 
            const i_monthly = i_annual / 12;
            if (i_annual === 0) {
                monthlyPayment = P / n_total_months;
                totalInterest = 0;
            } else {
                monthlyPayment = P * (i_monthly * Math.pow(1 + i_monthly, n_total_months)) / (Math.pow(1 + i_monthly, n_total_months) - 1);
                totalInterest = (monthlyPayment * n_total_months) - P;
            }
            totalCost = P + totalInterest;
        } else { 
            const i1_annual = parseFloat(interestRateInput.value) / 100; 
            const i2_annual = parseFloat(secondaryInterestRateInput.value) / 100;
            let k_months; 
            if (changeUnitSelect.value === 'years') {
                k_months = parseFloat(changePeriodInput.value) * 12;
            } else {
                k_months = parseFloat(changePeriodInput.value);
            }

            if (isNaN(i2_annual) || i2_annual < 0) { 
                 alert('Por favor, introduce un tipo de interés posterior válido.');
                 secondaryInterestRateInput.focus(); return;
            }
            if (isNaN(k_months) || k_months <= 0 || k_months >= n_total_months) {
                alert('El periodo de cambio de tipo debe ser mayor que 0 y menor que el plazo total de amortización.');
                changePeriodInput.focus(); return;
            }
            
            const i1_monthly = i1_annual / 12;
            const i2_monthly = i2_annual / 12;
            let M_temp_for_first_period_calc = 0; 
            
            if (i1_annual === 0) { 
               
                M_temp_for_first_period_calc = P / n_total_months; 
            } else { 
                
                M_temp_for_first_period_calc = P * (i1_monthly * Math.pow(1 + i1_monthly, n_total_months)) / (Math.pow(1 + i1_monthly, n_total_months) - 1); 
            }
            monthlyPayment = M_temp_for_first_period_calc; 
            
            let outstandingBalance = P; 
            totalInterest = 0; 

            for (let month = 1; month <= k_months; month++) {
                if (outstandingBalance <= 0.005) { 
                    outstandingBalance = 0; 
                    break;
                }
                let currentPaymentForLoop = monthlyPayment; 
                let interestForMonth = outstandingBalance * i1_monthly;
                let principalPayment = currentPaymentForLoop - interestForMonth;

               
                if (principalPayment > outstandingBalance) { 
                    principalPayment = outstandingBalance;
                    
                }
                 if (outstandingBalance - principalPayment < 0 && outstandingBalance > 0) { 
                    principalPayment = outstandingBalance;
                }
                
                outstandingBalance -= principalPayment;
                totalInterest += interestForMonth;
            }

            
            const remainingMonths = n_total_months - k_months;
            if (outstandingBalance > 0.005 && remainingMonths > 0) {
                let M2 = 0;
                if (i2_annual === 0) { 
                    M2 = outstandingBalance / remainingMonths; 
                } else { 
                    M2 = outstandingBalance * (i2_monthly * Math.pow(1 + i2_monthly, remainingMonths)) / (Math.pow(1 + i2_monthly, remainingMonths) - 1); 
                }
                
                for (let month = 1; month <= remainingMonths; month++) {
                     if (outstandingBalance <= 0.005) {
                        outstandingBalance = 0;
                        break;
                    }
                    let currentPaymentForLoop = M2; 
                    let interestForMonth = outstandingBalance * i2_monthly;
                    let principalPayment = currentPaymentForLoop - interestForMonth;

                    if (principalPayment > outstandingBalance) {
                       principalPayment = outstandingBalance;
                       
                    }
                     if (outstandingBalance - principalPayment < 0 && outstandingBalance > 0) { 
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
        
        while (chimneyArea.firstChild) {
            chimneyArea.removeChild(chimneyArea.firstChild);
        }

        for (let i = 0; i < numHearts; i++) {
            setTimeout(() => {
                if (!chimneyArea) return; 
                const heart = document.createElement('div');
                heart.classList.add('heart-particle');
                
                const randomXPercentage = (Math.random() - 0.5) * 80; 
                heart.style.setProperty('--random-x', `${randomXPercentage}%`);
                
                heart.style.left = `${20 + Math.random() * 60}%`; 
                heart.style.top = `${50 + Math.random() * 40}%`;   

                chimneyArea.appendChild(heart);

                heart.addEventListener('animationend', () => {
                    if(heart && heart.parentNode === chimneyArea) { 
                         heart.remove();
                    }
                }, { once: true }); 
            }, i * 120); 
        }
    }
});