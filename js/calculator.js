
      resetContent();
      $('.menu .item')
        .tab()
        ;

      $('.ui.accordion')
        .accordion({
          exclusive: false
        })
        ;

      var currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'JMD',
        minimumFractionDigits: 2,
      });

      function taxDescription(shortDescription) {
        const descriptionMap = {
          id: "Import Duty",
          scta: "Special Consumption Tax Ad Valorem",
          scts: "Special Consumption Tax Specific",
          sctf: "Special Consumption Tax Fixed",
          envl: "Environmental Levy",
          dcess: "Dairy Cess",
          excise: "Excise",
          caf: "Customs Administrative Fee",
          sd: "Stamp Duty",
          asd: "Additional Stamp Duty",
          gct: "General Consumption Tax",
          scf: "Standard Compliance Fee",
          insurance: "Insurance",
          shipping: "Shipping",
          cif: "Cost, Insurance and Freight"
        };
        return descriptionMap[shortDescription];
      }

      function setAPIKey() {
        apiKey = $('#api_key').val();
        localStorage.setItem("apiKey", apiKey);
      }

      // Format input HS code from 0123456789 to 01235.6789 (10 Digits) or
      // 012345 to 0123.45 (6 Digits)
      function formatHSCode(code) {
        var universal = /^(\d{4})(\d{2})/;
        var country = /^(\d{4})(\d{2})(\d+)/;
        if (country.test(code)) {
          code = code.replace(country, '$1' + '.' + '$2' + "." + '$3');
        }
        else if (universal.test(code)) {
          code = code.replace(universal, '$1' + '.' + '$2');
        }
        return code;
      }

      // Format key names in features to human readable formats
      function formatKeys(key) {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        key = key.replace(/_/g, " ");
        return key;
      }

      // Output a confidence scale based on input confidence score
      function confidenceScale(score) {
        if (score > 0.8) {
          return 'green'
        }
        else if (score > 0.5) {
          return 'orange'
        }
        else {
          return 'red'
        }
      }

      function confidenceText(score) {
        if (score > 0.8) {
          return 'High'
        }
        else if (score > 0.5) {
          return 'Moderate'
        }
        else {
          return 'Low'
        }
      }

      function confidenceScaleTable(score) {
        if (score > 0.8) {
          return 'positive'
        }
        //else if (score > 0.5) {
        //  return 'warning'
        //}
        //else {
        //  return 'negative'
        //}
      }

      function searchAgain(){
        $('ul#navbar a[id=0]').trigger('click');
      }

      function removeItem(){
         var id = $('div#shipment > div.ui.pagination > a[class~="active"]').attr("id");
         var cart = JSON.parse(localStorage.getItem("cart"));
         cart.splice(id-1, 1);
         localStorage.setItem("cart", JSON.stringify(cart));
         showShipments();
      }

      function clearCart(){
        localStorage.removeItem("cart");
        showCartEstimate();
      }

      function cartItem(item) {
        var priceEstimate = currencyFormat.format(parseFloat(item.price_estimate).toFixed(2))
        var processingFee = parseFloat(item.processing_fee);
        var weightEstimate = parseFloat(item.weight_estimate.weight / 1000000).toFixed(2);
        var quantity = parseInt(item.quantity);
        if (weightEstimate > 0.0) {
          weightEstimate = weightEstimate + " Kg"
        }
        else {
          weightEstimate = "N/A"
        }
        var pricerow = "<tr><td style='font-weight:700'> Unit Price </td><td>" + priceEstimate + '</td><tr>'
        var weightrow = "<tr><td style='font-weight:700'> Unit Weight </td><td>" + weightEstimate + '</td><tr>'
        var quantityrow = "<tr><td style='font-weight:700'> Quantity </td><td>" + quantity + '</td><tr>'
        var cif = "<tr class='positive'><td style='font-weight:700'> Base Value, (Cost + Insurance + Freight) </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['cif']) + '</td><tr>'
        var rates = item.tax_lookup[item.preferred_code]["rates"];
        var rows = [pricerow, weightrow, quantityrow, cif];
        $.each(item.tax_lookup[item.preferred_code], function (key, value) {
          if (value > 0) {
            var taxrow;
            if (!key.includes("total") && key != "cif" && key != "rates") {
              if (key in rates) {
                taxrow = "<tr><td style='font-weight:700'>" + taxDescription(key) + ` @ ${rates[key] * 100}%` + "</td><td>"
              }
              else {
                taxrow = "<tr><td style='font-weight:700'>" + taxDescription(key) + "</td><td>"
              }
              taxrow += currencyFormat.format(value)
              taxrow += '</td><tr>'
              rows.push(taxrow);
            }
          }
        });
        var totalTax = "<tr class='positive'><td style='font-weight:700'> Total Taxes </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['total_tax']) + '</td><tr>';
        rows.push(totalTax);
          var total = "<tr class='positive'><td style='font-weight:700'> Total Landed Cost </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['total'] - processingFee) + '</td><tr>';
        rows.push(total);
        return `<div class="item">
          <div class="large image">
            <img id="product_image" src="${item.products[0].images[0]}">
          </div>
          <div class="content">
              <a class="header" id="product_name" href="${item.products[0].url}">${item.products[0].name}</a>
              <div class="ui large left pointing teal label">
                    Reference Product
                  <i class="info circle icon"
                    title="Your input query was matched to this reference product - details of this product are used for the classification below."></i>
              </div>
              <table class="ui celled padded table">
                  <tbody>
                    ${rows.join(' ')}
                  </tbody>
              </table>
              <div class="ui one column grid">
                <div class="column">
                  <button class="ui fluid button" onclick='removeItem()'> Remove Item </button>
                </div>
            </div>
          </div>
      </div>`
      }

      function estimateItem (item) {
        var priceEstimate = currencyFormat.format(parseFloat(item.price_estimate).toFixed(2))
        var processingFee = parseFloat(item.processing_fee);
        var weightEstimate = parseFloat(item.weight_estimate/ 1000000).toFixed(2);
        var quantity = parseInt(item.quantity);
        if (weightEstimate > 0.0) {
          weightEstimate = weightEstimate + " Kg"
        }
        else {
          weightEstimate = "N/A"
        }
        var pricerow = "<tr><td style='font-weight:700'> Price </td><td>" + priceEstimate + '</td><tr>'
        var weightrow = "<tr><td style='font-weight:700'> Weight </td><td>" + weightEstimate + '</td><tr>'
        var quantityrow = "<tr><td style='font-weight:700'> Number of Products </td><td>" + quantity + '</td><tr>'
        var cif = "<tr class='positive'><td style='font-weight:700'> Base Value, (Cost + Insurance + Freight) </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['cif']) + '</td><tr>'
        var rates = item.tax_lookup[item.preferred_code]["rates"];
        var rows = [pricerow, weightrow, quantityrow, cif];
        $.each(item.tax_lookup[item.preferred_code], function (key, value) {
          if (value > 0) {
            var taxrow;
            if (!key.includes("total") && key != "cif" && key != "rates") {
              taxrow = "<tr><td style='font-weight:700'>" + taxDescription(key) + "</td><td>"
              taxrow += currencyFormat.format(value)
              taxrow += '</td><tr>'
              rows.push(taxrow);
            }
          }
        });
        var totalTax = "<tr class='positive'><td style='font-weight:700'> Total Taxes </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['total_tax']) + '</td><tr>';
        rows.push(totalTax);
          var total = "<tr class='positive'><td style='font-weight:700'> Total Landed Cost </td><td>" + currencyFormat.format(item.tax_lookup[item.preferred_code]['total'] - processingFee) + '</td><tr>';
        rows.push(total);
        return `<div class="item">
          <div class="large image">
            <i class="massive shopping cart icon"></i>
          </div>
          <div class="content">
              <a class="header" id="product_name" href="${item.products[0].url}">${item.products[0].name}</a>
              <table class="ui celled padded table">
                  <tbody>
                    ${rows.join(' ')}
                  </tbody>
              </table>
              <div class="ui one column grid">
                <div class="column">
                  <button class="ui fluid button" id="clear-shipment" onclick="clearCart()"> Clear Shipment </button>
                </div>
            </div>
          </div>
      </div>`
      }

      function renderCartEstimate(cart){
        var finalItem = { 'tax_lookup' : { "preferred_code" : {} }, 'preferred_code': "preferred_code" };
        var taxCodes = {};
        cart.forEach(item => {
          finalItem.price_estimate =  (finalItem.price_estimate || 0) + parseFloat(item.price_estimate);
          finalItem.processing_fee =  (finalItem.processing_fee || 0) + parseFloat(item.processing_fee);
          finalItem.weight_estimate = (finalItem.weight_estimate || 0) + parseFloat(item.weight_estimate.weight);
          finalItem.quantity = (finalItem.quantity || 0) + parseInt(item.quantity);
          var taxPreffered = item.tax_lookup[item.preferred_code];
          $.each(taxPreffered, function(key, value) {
              if (key != "rates") {
                taxCodes[key] = (taxCodes[key] || 0) + value;
              }
          });
        });
        finalItem.tax_lookup.preferred_code = taxCodes;
        finalItem.tax_lookup.preferred_code.rates = {};
        finalItem.products = [{"name" : `Shipment containing ${cart.length} items`, "images" : [""], "url" : ""}]
        $('div#total_shipment > div.ui.items').empty();
        $('div#total_shipment > div.ui.items').append(estimateItem(finalItem));
      }

      function showCartEstimate(){
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length == 0) {
          $('div#total_shipment').hide();
          $('div#total_shipment_message').show();
        }
        else {
          $('div#total_shipment_message').hide();
          $('div#total_shipment').show();
          renderCartEstimate(cart);
        }
      }

      function renderShipments(cart) {
        $('div#shipment > div.ui.items').empty();
        $('div#shipment > div.ui.items').append(cartItem(cart[0]));
        $('div#shipment > div.ui.pagination').empty();
        $('div#shipment > div.ui.pagination').append('<a class="item active" id=1> 1 </a>');
        var pages = [];
        for (let index = 1; index < cart.length; index++) {
          $('div#shipment > div.ui.pagination').append(`<a class="item" id=${index+1}>${index+1}</a>`);
        }
        $('div#shipment > div.ui.pagination > a').click(function(){
          var id = $(this).attr('id');
          $('div#shipment > div.ui.items').empty();
          $('div#shipment > div.ui.items').append(cartItem(cart[id - 1]));
          $('div#shipment > div.ui.pagination > a[class~="active"]').removeClass("active")
          $(this).addClass("active");
        });
      }

      function showShipments() {
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length == 0) {
          $('div#shipment').hide();
          $('div#shipment_message').show();
        }
        else {
          $('div#shipment').show();
          $('div#shipment_message').hide();
          renderShipments(cart);
        }

      }

      function resetContent() {
        $('div#product_info_tax').hide()
        $('div#product_info').hide()
        // $('div#shipment').hide()
        $('tbody#estimates').html("")
        $('div#search_loader').hide()
        $('div#search_loader').progress('reset');
        $('div#searchresult').html("")
        $('tbody#hsresult').html("")
        $('#search-tax > div.results').empty()
        $('#search-tax > div.results').removeClass("transition")
        $('#search-tax > div.results').removeClass("visible")
        $('#search-tax > div.results').removeAttr("style")
        $('form').removeClass('error')
        $('#search-placeholder').removeClass('error')
        $('form').show()
        $('button#search-tax-run').show()
        $('div#hscode_search').hide()
        $('.ui.dropdown#hscode')
          .dropdown({ 'action': 'activate' });
        sessionStorage.removeItem("response");
        //$('div#search_loader').removeClass('active')
      }

      var backendUrl = 'http://customs.sem3.in/';

      $("#specs button").click(function () {
        alert("Semantics3's data team has been notified of this. Thank you.");
        resetContent();
        $('#search').search('set value', '');
        $('.ui.accordion').accordion('close', 0);
      });

      $('.ui.dropdown#hscode')
        .dropdown();
      ;

      $('#search-tax').focus(function () {
        resetContent()
      });

      $('#hscode_search').search({
        source: allHSCodes,
        fields: {
          'title' : 'code',
          'description' : 'description'
        },
        searchFields : ['code', 'description'],
        onSelect: function(searchResult, response){
          var result = JSON.parse(sessionStorage.getItem("response"));
          var value = searchResult['code'];
          $('tbody#estimates').empty();
          $.ajax({
            url: backendUrl + `tax/estimate?price=${result['price_estimate']}&code=${value}&freight=${result['freight']}&insurance=${result['insurance']}&quantity=${result['quantity']}`,
            type: "GET",
            success: function (data) {
              result["tax_lookup"][value] = data;
              sessionStorage.setItem("response", JSON.stringify(result));
              var priceEstimate = currencyFormat.format(parseFloat(result.price_estimate).toFixed(2))
              var processingFee = parseFloat(result.processing_fee);
              var weightEstimate = parseFloat(result.weight_estimate.weight / 1000000).toFixed(2);
              var quantity = parseInt(result.quantity);
              if (weightEstimate > 0.0) {
                weightEstimate = weightEstimate + " Kg"
              }
              else {
                weightEstimate = "N/A"
              }
              var pricerow = "<tr><td style='font-weight:700'> Unit Price </td><td>" + priceEstimate + '</td><tr>'
              $('tbody#estimates').append(pricerow);
              var weightrow = "<tr><td style='font-weight:700'> Unit Weight </td><td>" + weightEstimate + '</td><tr>'
              $('tbody#estimates').append(weightrow);
              var quantityrow = "<tr><td style='font-weight:700'> Quantity </td><td>" + quantity + '</td><tr>'
              $('tbody#estimates').append(quantityrow);
              var cif = "<tr class='positive'><td style='font-weight:700'> Base Value, (Cost + Insurance + Freight) </td><td>" + currencyFormat.format(data['cif']) + '</td><tr>'
              $('tbody#estimates').append(cif);
              var rates = data["rates"];
              $.each(data, function (key, value) {
                if (value > 0) {
                  var taxrow;
                  if (!key.includes("total") && key != "cif" && key != "rates") {
                    if (key in rates) {
                      taxrow += "<tr><td style='font-weight:700'>" + taxDescription(key) + ` @ ${rates[key] * 100}%` + "</td><td>"
                    }
                    else {
                      taxrow += "<tr><td style='font-weight:700'>" + taxDescription(key) + "</td><td>"
                    }
                  }
                  taxrow += currencyFormat.format(value)
                    + '</td><tr>'
                  $('tbody#estimates').append(taxrow);
                }
              });
              var totalTax = "<tr class='positive'><td style='font-weight:700'> Total Taxes </td><td>" + currencyFormat.format(data['total_tax']) + '</td><tr>';
              $('tbody#estimates').append(totalTax);
                var total = "<tr class='positive'><td style='font-weight:700'> Total Landed Cost </td><td>" + currencyFormat.format(data['total'] - processingFee) + '</td><tr>';
              $('tbody#estimates').append(total);
              $('button#save-suggestion').html(`Confirm "${formatHSCode(value)}" and add to Shipment`);
            }
          });
        }
      });

      // $('div#hscode_input').keypress(function (){
      //   var keycode = event.keyCode || event.which;
      //   if(keycode == 13){
      //   }
      // });

      function dispatchAPI(mode) {
        if (mode == "url") {
          return backendUrl + 'jam/estimate?q={query}';
        }
        else {
          return backendUrl + 'ali/price?q={query}&ali=1&crawl=0&mode=' + mode
        }
      }

      function getMode() {
        return $('form').serializeArray()[0]["value"];
      }

      function saveAnswer() {
        const request = $('form').serializeArray().reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
        var response = JSON.parse(sessionStorage.getItem("response"));
        const selectedCode = $('.ui.dropdown#hscode').dropdown('get value');
        if (selectedCode != "nab") {
          response["preferred_code"] = selectedCode;
        }
        else {
          response["preferred_code"] = $('div#hscode_search input').val();
        }
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(response);
        localStorage.setItem("cart", JSON.stringify(cart));
        $.ajax({
          url: backendUrl + 'cst',
          type: "POST",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({ "query": request, "response": response, "clicked_value": response["preferred_code"], "endpoint": "/jam/estimate?courier" }),
          success: function (data) {
            alert("This product has been added to your shipment summary.");
            // resetContent();
          }
        });
      }

      $('select.dropdown#mode').change(function () {
        let value = $('select option:selected').attr("value");
        let placeholder;
        let label;
        if (value == 'product') {
          placeholder = 'iphone 11 128gb';
          label = "Description";
        }
        else if (value == 'upc') {
          placeholder = '883974958450';
          label = "UPC";
        }
        else if (value == 'asin') {
          placeholder = 'B07B8YBX7V';
          label = "ASIN";
        }
        else if (value == "url") {
          placeholder = "https://www.aliexpress.com/item/4000191320535.html";
          label = "URL";
        }
        $('input.prompt#q').val('');
        $('input.prompt#q').attr('placeholder', placeholder);
        $('label#input_label').html(label);
      });

      $('#search-tax')
        .search({
          minCharacters: 3,
          debug: false,
          cache: true,
          maxResults: 1,
          searchDelay: 100000000000,
          selectFirstResult: true,
          searchOnFocus: false,
          selector: {
            searchButton: '#search-tax-run'
          },
          showNoResults: false,
          apiSettings: {
            url: backendUrl + 'jam/estimate?q={query}&email=jma',
            //beforeXHR: function(xhr){
            //  xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa("demouser:"+apiKey));
            //  return xhr;
            //},
            beforeSend: function (query) {
              var mode = getMode();
              if (mode == 'url') {
                query.url = backendUrl + 'jam/estimate?email=jma' + $('form').serialize()
              }
              else {
                query.url = backendUrl + 'ali/price?email=jma' + $('form').serialize();
              }
              return query
              // query.url = dispatchAPI(mode)
              // if (mode == 'url'){
              //   if (/^http[s]?\:\/\//.test(query.urlData.query) != 1) {
              //     $('#search-placeholder').addClass('error')
              //     resetContent();
              //     $('#search-tax').search('display message',"Please enter a valid URL", "error")
              //     return false
              // }
              // else {
              //     $('#search-placeholder').removeClass('error')
              //     resetContent();
              //     return query
              // }
              // }
            },
            onFailure: function (response, element) {
              if (response.status == 422) {
                resetContent();
                clearInterval(window.fakeProgress);
                $('form').addClass('error');
                $('#search-placeholder').addClass('error')
                $('div#query-error').html(response.error);
                // $('#search-tax').search('display message', response.error, "error")
              }
              else {
                alert("Something unexpected happened. Rest assured, our team is working on fixing it as soon as possible. Please check back shortly!");
                resetContent();
              }
            },
            onRequest: function (promise, xhr) {
              resetContent();
              $('div#search_loader').addClass('active');
              $('div#search_loader').show();
              $('div#search_loader').progress('set percent', 50);
              //   window.fakeProgress = setInterval(function(){
              //       $('div#search_loader').progress('increment', 5);
              //       var progressPercent = $('div#search_loader').progress('get percent');
              //       // console.log(progressPercent);
              //       if(progressPercent >= 95){
              //         $('div#search_loader').progress('set percent', 10);
              //       }
              // }, 1000);
              $('div#search-tax').removeClass('loading')
            },
            onResponse: function (result) {
              resetContent();
              clearInterval(window.fakeProgress);
              $('div#search_loader').progress('complete');
              $('form').hide();
              $('button#search-tax-run').hide();
              sessionStorage.setItem("response", JSON.stringify(result));
              var priceEstimate = currencyFormat.format(parseFloat(result.price_estimate).toFixed(2))
              var processingFee = parseFloat(result.processing_fee);
              var weightEstimate = parseFloat(result.weight_estimate.weight / 1000000).toFixed(2);
              var quantity = parseInt(result.quantity);
              if (weightEstimate > 0.0) {
                weightEstimate = weightEstimate + " Kg"
              }
              else {
                weightEstimate = "N/A"
              }
              // var taxEstimateStr;
              // if(result.tax_estimate.min.total == result.tax_estimate.max.total){
              //     taxEstimateStr = currencyFormat.format(result.tax_estimate.min.total)
              // }
              // else {
              //     taxEstimateStr = `${currencyFormat.format(result.tax_estimate.min.total)} to ${currencyFormat.format(result.tax_estimate.max.total)}`
              // }
              if (typeof result.products !== 'undefined') {
                var product = result.products[0]
                var images = product.images;
                if (images.length > 0) {
                  $('img#product_image').attr("src", result.products[0].images[0])
                }
                else {
                  $('img#product_image').attr("src", "../images/imagenotfound.jpg")
                }
                $('a#product_name').attr("href", product.url)
                $('a#product_name').attr("target", "_blank")
                $('a#product_name').html(product.name)
                // $('div.meta span#price').html(priceEstimate)
                // $('div.description p').html("Price: "+priceEstimate)
                var bestHS = result.suggestions[0];
                // $('div#best_suggestion').html(bestHS.code + " - " + bestHS.description)
                var values = [];
                const suggestions = result.suggestions;
                for (const idx in suggestions) {
                  var name = `${formatHSCode(suggestions[idx].code)} - ${suggestions[idx].subheading_text}`;
                  if (suggestions[idx].subheading_text != suggestions[idx].description) {
                    name = name + ` > ${suggestions[idx].description}`
                  }
                  values.push({
                    name: name,
                    value: suggestions[idx].code
                  });
                }
                values.push({
                  name: 'None of the above',
                  value: 'nab'
                });

                values[0].selected = true
                $('#options-count').html(values.length - 1)
                $('.ui.dropdown#hscode')
                  .dropdown(
                    {
                      values: values,
                      onChange: function (clickedValue, text, choice) {
                        $('tbody#estimates').empty();
                        if (clickedValue != "nab" && clickedValue != "") {
                          var pricerow = "<tr><td style='font-weight:700'> Unit Price </td><td>" + priceEstimate + '</td><tr>'
                          $('tbody#estimates').append(pricerow);
                          var weightrow = "<tr><td style='font-weight:700'> Unit Weight </td><td>" + weightEstimate + '</td><tr>'
                          $('tbody#estimates').append(weightrow);
                          var quantityrow = "<tr><td style='font-weight:700'> Quantity </td><td>" + quantity + '</td><tr>'
                          $('tbody#estimates').append(quantityrow);
                          var cif = "<tr class='positive'><td style='font-weight:700'> Base Value, (Cost + Insurance + Freight) </td><td>" + currencyFormat.format(result.tax_lookup[clickedValue]['cif']) + '</td><tr>'
                          $('tbody#estimates').append(cif);
                          var rates = result.tax_lookup[clickedValue]["rates"];
                          $.each(result.tax_lookup[clickedValue], function (key, value) {
                            if (value > 0) {
                              var taxrow;
                              if (!key.includes("total") && key != "cif" && key != "rates") {
                                if (key in rates) {
                                  taxrow += "<tr><td style='font-weight:700'>" + taxDescription(key) + ` @ ${rates[key] * 100}%` + "</td><td>"
                                }
                                else {
                                  taxrow += "<tr><td style='font-weight:700'>" + taxDescription(key) + "</td><td>"
                                }
                              }
                              taxrow += currencyFormat.format(value)
                                + '</td><tr>'
                              $('tbody#estimates').append(taxrow);
                            }
                          });
                          var totalTax = "<tr class='positive'><td style='font-weight:700'> Total Taxes </td><td>" + currencyFormat.format(result.tax_lookup[clickedValue]['total_tax']) + '</td><tr>';
                          $('tbody#estimates').append(totalTax);
                          var total = "<tr class='positive'><td style='font-weight:700'> Total Landed Cost </td><td>" + currencyFormat.format(result.tax_lookup[clickedValue]['total'] - processingFee
                          ) + '</td><tr>';
                          $('tbody#estimates').append(total);
                          $('button#save-suggestion').html(`Confirm "${formatHSCode(clickedValue)}" and add to Shipment`);
                          $('div#hscode_search').hide()
                        }
                        else {
                          $('button#save-suggestion').html('Confirm');
                          $('div#hscode_search').show()
                          // $.ajax({
                          //   url: backendUrl+'cst',
                          //   type: "POST",
                          //   contentType: "application/json",
                          //   dataType: "json",
                          //   data: JSON.stringify({"query": product.url, "response": result, "clicked_value": clickedValue, "endpoint": "/jam/estimate?courier"}),
                          //   success: function(data){
                          //     // alert( "Semantics3's data team has been notified of this. Thank you. For further clarifications about the applicable code please reach out to the Customs Department" );
                          //     // resetContent();
                          //     cosole.log("NOTA logged");
                          //   }
                          // });
                        }
                      }
                    }
                  );
                $('div#product_info_tax').show();
              }
              else {
                resetContent();
                $('#search-placeholder').addClass('error')
                console.log(result);
                $('#search-tax').search('display message', "We are unable to fetch the product at this time or it is not a product url", "error")
              }
            }
          }
        });