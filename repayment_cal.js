#########################################
#
# These functions calculate the home and gold loan repayments at current applicable rates.
# The user needs to select the amount, period and the portal does the rest.
#
# All the leading banks interest rates are taken as hard coded values as scraping 30 websites
# is not reliable enough because of the dynamic nature of their sites.
# As the interest rates change once in a month, this is not a big problem and keep the
# solution cheap for now. Scrapy will be used in case of web scarping for details.
# 
########################################

// Stripedtable function to load and display back the results on UI.
function stripedTable() {
	if (document.getElementById && document.getElementsByTagName) {  
		var allTables = document.getElementsByTagName('table');
		if (!allTables) { return; }

		for (var i = 0; i < allTables.length; i++) {
			if (allTables[i].className.match(/[\w\s ]*scrollTable[\w\s ]*/)) {
				var trs = allTables[i].getElementsByTagName("tr");
				for (var j = 0; j < trs.length; j++) {
					removeClassName(trs[j], 'alternateRow');
					addCSSClass(trs[j], 'normalRow');
				}
				for (var k = 0; k < trs.length; k += 2) {
					removeClassName(trs[k], 'normalRow');
					addCSSClass(trs[k], 'alternateRow');
				}
			}
		}
	}
}

function tocomma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addCSSClass (elem, className) {
	removeClassName (elem, className);
	elem.className = (elem.className + " " + className).trim();
}

String.prototype.trim = function() {
	return this.replace( /^\s+|\s+$/, "" );
}

jQuery(function($) {
  var targets = ['Facebook', 'LinkedIn', 'Twitter', 'GPlus'];
  $('.popup').BEShare({
    'class': 'popup-share',
    //'targets': 'Facebook,Twitter|Print,Email',
    'targets': targets
  });

  $('.inline-share').BEShare({
    'type': 'inline',
    'targets': targets.concat(['|', 'Print', 'Email']),
    'onShare': function(targetName) {
      ga('send', 'event', 'Social', 'Click', 'Share', targetName);
    }
  });
});


function toggle(divID) {
    var ele = document.getElementById(divID);
    
    if(ele.style.display == "block") {
            ele.style.display = "none";
        
    }
    else {
        ele.style.display = "block";
        
    }
}

function format_num(id) {
		var number = document.getElementById(id).value;
        number += '';
        number = number.replace(",","");
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        document.getElementById(id).value = x1 + x2;
}

function number2text(id) {
	var amnt = document.getElementById(id).value;
	document.getElementById('errorloanamtMissing').style.visibility='hidden';
	amnt = amnt.replace(/\D/g,'');
    var fraction = Math.round(frac(amnt)*100);
    var f_text  = "";
		
    var ret_var = convert_number(amnt);
	if (ret_var == '')
	{
		ret_var;
	}
	else
	{
		ret_var = "Rs. "+ret_var;
	}
	document.getElementById('amntinword').style.visibility='visible';
	document.getElementById("amntinword").innerHTML = ret_var;
}

// Function for readibility, print back the loan amount in words for user.
function convert_number(number)
{
    if ((number < 0) || (number > 999999999)) 
    { 
        return "Amount out of Range.";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */ 
    number -= Gn * 10000000; 
    var kn = Math.floor(number / 100000);     /* lakhs */ 
    number -= kn * 100000; 
    var Hn = Math.floor(number / 1000);      /* thousand */ 
    number -= Hn * 1000; 
    var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
    number = number % 100;               /* Ones */ 
    var tn= Math.floor(number / 10); 
    var one=Math.floor(number % 10); 
    var res = ""; 

    if (Gn>0) {res += (convert_number(Gn) + " Crore");} 
    if (kn>0) {res += (((res=="") ? "" : " ") + convert_number(kn) + " Lakh");} 
    if (Hn>0) {res += (((res=="") ? "" : " ") + convert_number(Hn) + " Thousand");} 
    if (Dn) {res += (((res=="") ? "" : " ") + convert_number(Dn) + " Hundred");} 


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six","Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen","Fourteen", 
	"Fifteen", "Sixteen", "Seventeen", "Eighteen","Nineteen"); 
	var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty","Seventy", "Eighty", "Ninety"); 

    if (tn>0 || one>0) 
    { 
        if (!(res==""))  { res += " And ";} 
        if (tn < 2) 
        { 
            res += ones[tn * 10 + one]; 
        } 
        else 
        { 
            res += tens[tn];
            if (one>0) 
            { 
                res += ("-" + ones[one]); 
            } 
        } 
    }
    return res;
}

function cal_all_gold_emi()
{
	var loanAmt = localStorage.getItem("loanamt_personal");
	var loanTenor = localStorage.getItem("loantenor_personal");
	var ret_emi_arr = [];
	var ret_emi;
	document.getElementById ('disloanamt').innerHTML = loanAmt;
	document.getElementById ('disloanten').innerHTML = loanTenor;
	
	//I need a better way to send a has with min and max value, although its not about always min and max But really 'multiple values/ROI'
	//I need a function to calculate the average or display value for each roi of the bank. Showing Average is Not making sense.
	var roi_arr = ["10.25", "10.75", "14", "14.25", "14.75", "15.5", "14", "16.5", "15.5", "15.20", "16.5","15.75",
	"15.05", "16.90", "15.75", "16.5", "16.75", "17", "17.4", "17.65", "18.25", "28"];
	
	for (i=0; i<roi_arr.length; i++)
	{
		ret_emi = calc_gold_emi(loanAmt, loanTenor, roi_arr[i]);
		if (isNaN(ret_emi) || ret_emi == '')
		{
			ret_emi = "*Estimated EMI";
		}
		document.getElementById("displayroi"+i).innerHTML = '&#8377; ' + ret_emi;
	}
}

function calc_gold_emi(loan_amount, loan_tenure, bankroi_tmp)
{ 
	var bankroi = (bankroi_tmp /1200);
	var temp = (1 + +bankroi);
	var emi_period = (loan_tenure*12);
	var expon = (Math.pow(temp , emi_period ));
	var temp2 = (expon - 1);
	var div1 = (expon / temp2).toFixed(4);
	var emitopay = (loan_amount * bankroi * div1).toFixed(2);
	return emitopay;
}

function cal_all_home_emi()
{
	var loanAmt = localStorage.getItem("loanamt_personal");
	var loanTenor = localStorage.getItem("loantenor_personal");
	var ret_emi_arr = [];
	var ret_emi;
	document.getElementById ('disloanamt').innerHTML = loanAmt;
	document.getElementById ('disloanten').innerHTML = loanTenor;
	
	//I need a better way to send a has with min and max value, although its not about always min and max But really 'multiple values/ROI'
	//I need a function to calculate the average or display value for each roi of the bank. Showing Average is Not making sense.
	var roi_arr = ["10.25", "10.75", "14", "14.25", "14.75", "15.5", "14", "16.5", "15.5", "15.20", "16.5","15.75",
	"15.05", "16.90", "15.75", "16.5", "16.75", "17", "17.4", "17.65", "18.25", "28"];
	
	for (i=0; i<roi_arr.length; i++)
	{
		ret_emi = calc_home_emi(loanAmt, loanTenor, roi_arr[i]);
		if (isNaN(ret_emi) || ret_emi == '')
		{
			ret_emi = "*Estimated EMI";
		}
		document.getElementById("displayroi"+i).innerHTML = '&#8377; ' + ret_emi;
	}
}

function calc_home_emi(loan_amount, loan_tenure, bankroi_tmp)
{ 
	var bankroi = (bankroi_tmp /1200);
	var temp = (1 + +bankroi);
	var emi_period = (loan_tenure*12);
	var expon = (Math.pow(temp , emi_period ));
	var temp2 = (expon - 1);
	var div1 = (expon / temp2).toFixed(4);
	var emitopay = (loan_amount * bankroi * div1).toFixed(2);
	return emitopay;
}

// Toggle gold loan visibility.
function reset_gold_loan()
{
	document.getElementById("goldtab").style.display="none";
	document.getElementById('hidemaintab').style.display="table";
	document.getElementById('more_opt_tab').style.display="none";
	var div1 = document.getElementById('emibutthide');
	div1.style.display="block";
	document.getElementById ("gold_tenure").value = '';
	document.getElementById("Gold_quant").value = '';
	document.getElementById("gold_metric").value = '';
	//document.getElementById('amt_in_words').style.visibility='hidden';
}

// Function to validate the user inputs and calculations.
function validate_gold_input()
	{
		var valid = true;
		var valid_msg = 'Please input the following Details:\r\n';
		var gold_amt = document.getElementById("Gold_quant").value;
		
		if (document.getElementById("gold_metric").value.length == 0)
		{
			document.getElementById("gold_metric").style.background ='#FF9797';
			document.getElementById('errorrgoldamt').style.visibility='visible';
			valid = false;
		}
		else
		{
			document.getElementById("Gold_quant").style.background ='#f8f8f8';
			document.getElementById('errorrgoldamt').style.visibility='hidden';
		}
		if(gold_amt == '' || isNaN(gold_amt) || gold_amt <= 0)
		{
			document.getElementById("Gold_quant").style.background ='#FF9797';
			document.getElementById('errorrgoldamt').style.visibility='visible';
			valid_msg = valid_msg + 'GOLD AMOUNT ENTERED.';
			valid = false;
		}
		else
		{
			document.getElementById("Gold_quant").style.background ='#f8f8f8';
			document.getElementById('errorrgoldamt').style.visibility='hidden';
		}	
			
		//Validate if gold loan tenure is not null.
		if (document.getElementById("gold_tenure").value.length == 0)
		{
			document.getElementById("gold_tenure").style.background ='#FF9797';
			document.getElementById('errorgoldten').style.visibility='visible';
			valid_msg = valid_msg + 'GOLD TENURE IS FALSE';
			valid = false;
		}
		else
		{
			document.getElementById("gold_tenure").style.background ='#f8f8f8';
			document.getElementById('errorgoldten').style.visibility='hidden';
		}
		
		return valid;
	}

// Function to calculate and return the gold loan repayment installments.
function calc_gold_emi(total_loan_value, emi_period1, bankroi_tmp)
{
		var mroi = (bankroi_tmp /1200);
		var temp = (1 + +mroi);
		var emi_period = (emi_period1*12);
		var expon = (Math.pow(temp , emi_period ));
		var temp2 = (expon - 1);
		var div1 = (expon / temp2).toFixed(4);
		var emitopay = (total_loan_value * mroi * div1);
		var totpaymt = (emitopay * emi_period).toFixed(2);
		emitopay = Math.round(emitopay);
		emitopay = format(emitopay);
		totpaymt = Math.round(totpaymt);
		totpaymt = format(totpaymt);
		//alert(totpaymt);
		return [emitopay, totpaymt];
		 
}

// Function to calculate the gold loan details from user input.
function calc_gold_loan() 
	{
		var gold_quantity = document.getElementById('Gold_quant').value;
		var gold_std = document.getElementById("gold_metric").value;
		var gold_period = document.getElementById("gold_tenure").value;
		var total_gold_value;
		var total_loan_value;
		var roi;
		var total_sum;
		var emi;
		var emi_period;
		var roi_arr = ["10.25-16","16.50","13-16.5","12.50","13-16"];
		
		
		//First Validate if the user inputs are all good. 
		//Then check if interest is provided by the user; depending on which make visible the required table.
		var ret_val = validate_gold_input(); 
		
		var tola = '26739';
		var gram1gold = (tola/10).toFixed(2);
		 		
		// Calculation :total gold from the user, total amount against gold
		// Gold quantity only in gms fro now, TBD for tola
		
		if(ret_val == true)
		{
			document.getElementById('more_opt_tab').style.display="table";
			document.getElementById("goldtab").style.display="table";
			document.getElementById('hidemaintab').style.display="none";
			var div1 = document.getElementById('emibutthide');
			div1.style.display="none";
			
			if(gold_std == 'Tola') 
			{ 
				total_gold_value = (tola*gold_quantity).toFixed(2);
			}
			else
			{
				total_gold_value = (gold_quantity*gram1gold).toFixed(2);
			}
			total_loan_value = (total_gold_value*0.75).toFixed(2);
			localStorage.setItem("loanamt", total_loan_value);
			localStorage.setItem("loantenor", gold_period);
			var emi_var;
			var avg_roi;
			
			for (i=0; i<roi_arr.length;i++)		
			{
				if (/-/.test(roi_arr[i]))
				{
					var min_max = roi_arr[i].split('-');
					avg_roi = ((+min_max[0] + +min_max[1]) / 2).toFixed(2);
					roi_arr[i] = avg_roi;
				}
				
				var ret = calc_gold_emi(total_loan_value, gold_period, roi_arr[i]);
				emi_var = ret[0];
				totpay = ret[1];
				document.getElementById ("displaygoldroi"+i).innerHTML = emi_var;
				document.getElementById ("displaygoldroj"+i).innerHTML = totpay;
				
			}
		}
		else
		{
			document.getElementById("goldtab").style.display="none";
		}
	}	

// Validate the UI user input, all the values are required or defaults to default value.
function validate_input()
{
		var valid = true;
		var valid_msg = 'Please input the following Details:\r\n';
								
		//Check if the user input is defined and not Null.
		if(document.getElementById ("loan_tenu").value.length == 0)
		{
			valid_msg = valid_msg + ' - Select the Loan Tenure.\r\n';
			document.getElementById ("loan_tenu").style.background ='#FF9797';
			document.getElementById('errorpertenMissing').style.visibility='visible';
			valid = false;
		}
		else
		{
			document.getElementById ("loan_tenu").style.background ='#f8f8f8';
			document.getElementById('errorpertenMissing').style.visibility='hidden';
		}

		var loan_amount = document.getElementById("loan_amt").value;
		loan_amount = loan_amount.replace(/\D/g,'');
		if (loan_amount == '' || loan_amount === null || isNaN(loan_amount) || loan_amount <= 0)
		{
			valid_msg = valid_msg + ' - Enter the Amount of the Loan Required. Ex:50000\r\n';
			document.getElementById("loan_amt").style.background ='#FF9797';
			document.getElementById('errorloanamtMissing').style.visibility='visible';
			valid = false;
		}
		else
		{
			document.getElementById("loan_amt").style.background ='#f8f8f8';
			document.getElementById('errorloanamtMissing').style.visibility='hidden';
		}
		
		return valid;		
	}

 //Function to calculate mortgage loan //
 function calc_mortgage_loan() 
	{
		var loan_amount = document.getElementById('loan_amt').value;
		loan_amount = loan_amount.replace(/\D/g,'');
		var loan_tenure = document.getElementById ("loan_tenu").value;
		//Passing user input to 'show_more_page' . Need to implement passing vars in URL and maybe cookies.(!)
		localStorage.setItem("loanamt_mortgage", loan_amount);
		localStorage.setItem("loantenor_mortgage", loan_tenure);
		var roi_arr = ["10.75-12.75","12.05","10.15-14.25","12.50","11.25-15"];
		var avg_roi ;
		var emi_var;
		//Validate User Input, Display the Table at only success. 
		var ret = validate_input();
		
		if(ret == true)
		{
				document.getElementById("goldtab").style.display="table";
				document.getElementById('hidemaintab').style.display="none";
				document.getElementById('more_opt_tab').style.display="table";
				var div1 = document.getElementById('emibutthide');
				div1.style.display="none";
				
			for (i=0; i<roi_arr.length;i++)		
			{
				if (/-/.test(roi_arr[i]))
				{
					var min_max = roi_arr[i].split('-');
					avg_roi = ((+min_max[0] + +min_max[1]) / 2).toFixed(2);
					roi_arr[i] = avg_roi;
				}
				
				var ret = calc_emih(loan_amount, loan_tenure, roi_arr[i]);
				emi_var = ret[0];
				totpay = ret[1];
				document.getElementById ("displaygoldroi"+i).innerHTML = emi_var;
				document.getElementById ("displaygoldroj"+i).innerHTML = totpay;
			}
		}
		else
		{
				document.getElementById("goldtab").style.display="none";
		}
	}	


	
// Function to calculate more personal loan . Uses same function as more _home_loan
function more_personal_loan()
{
	var loanAmt = localStorage.getItem("loanamt_personal");
	var loanTenor = localStorage.getItem("loantenor_personal");
	var ret_emi_arr = [];
	var ret_emi;
	var pfee;
	
	document.getElementById ('disloanamt').innerHTML = loanAmt;
	document.getElementById ('disloanten').innerHTML = loanTenor;
	
	//I need a better way to send a has with min and max value, although its not about always min and max But really 'multiple values/ROI'
	//I need a function to calculate the average or display value for each roi of the bank. Showing Average is Not making sense.
	var home_roi_arr = ["15", "15.25", "12.50", "18.50", "14.95", "15", "13.90", "14.50", "15.50", "15.25", "14","14", "17", "16", "13.5", "14.75", "17.25", "14.70", "14.25", "25", "14.50"];
	var home_pfee_arr = [".015", ".015", ".01", ".01", ".025", ".010", ".010", ".015", ".01", ".02", ".015",".02", ".01", ".01", ".01", ".025",".025",".025", ".015", ".02", ".01"]
	
	for (i=0; i<home_roi_arr.length; i++)
	{
		var ret = calc_more_home(loanAmt, loanTenor, home_roi_arr[i]);
		var emi_var = ret[0];
		var totpay = ret[1];
		if (isNaN(ret_emi) || ret_emi == '')
		{
			ret_emi = "*Estimated EMI";
		}
		// Print Estimated EMI and Processing Fee.
		var pfee1 = (home_pfee_arr[i] * loanAmt);
		pfee2 = (pfee1 * 0.1275);
        var pfee = pfee1 + +pfee2;
		ret_emi = tocomma(ret_emi);
		pfee = Math.round(pfee);
		pfee = tocomma(pfee);
		document.getElementById("displayroi"+i).innerHTML = '&#8377; ' + emi_var;
		document.getElementById("displaypfee"+i).innerHTML = '&#8377; ' + pfee;
		document.getElementById("displaytot"+i).innerHTML = '&#8377; ' + totpay;
	}
}

