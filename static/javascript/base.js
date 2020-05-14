window.onload=loadHomepage;
const loadXMLDoc = (method, url, dataToSend) => {
        return fetch(url,{
                      method: method,
                      body: JSON.stringify(dataToSend),
                      headers: dataToSend?{'content-type': 'application/json'} : {}
           }).then(response => {
                return response.json(); // This also creates a promise, instead of utilizing the then here, we use it later
           });
};

const loadXMLDocGET = (method, url) => {
        return fetch(url,{
                      method: method
           }).then(response => {
           console.log("GETTING DATA-GET METHOD")
                return response.json(); // This also creates a promise, instead of utilizing the then here, we use it later
           });
};

function loadSearchPage(){
    const sendDataSearchPage = () => {
        var formFields = document.forms.searchForm;
        var formData = new FormData(formFields);
        // Form Data -- Keyword, From date and to Date
        keyword = formData.get('keyword')
        fromdate = formData.get('fromdate')
        todate = formData.get('todate')
        // Category Selected
        categorySel = document.getElementById('searchForm').category.options
        selectedCategoryValue = categorySel[document.getElementById('searchForm').category.options.selectedIndex].value
        //alert(selectedCategoryValue)
        // Source Selected
        sourceSel = document.getElementById('searchForm').source.options
        selectedSourceValue = sourceSel[document.getElementById('searchForm').source.options.selectedIndex].value
        // Validating The Keyword field
        let f = formFields[0]
        // Date Validation
        fromdateValidator = new Date(fromdate)
        todateValidator = new Date(todate)

        if(fromdateValidator > todateValidator){
            alert("Incorrect Time")
        }
        else{
            // Variables
            // Call this only if everything is right
            dataForSearch = {page:"searchpage", q:keyword, Fdate:fromdate, Tdate:todate, category:selectedCategoryValue, source:selectedSourceValue}
            formDataQueryString = "?page=searchpage&q="+keyword+"&Fdate="+fromdate+"&Tdate="+todate+"&category="+selectedCategoryValue+"&source="+selectedSourceValue;
            console.log("form data below")
            console.log(formDataQueryString)
            urlformat = '/fetchsearch'+ formDataQueryString
            loadXMLDocGET('GET',urlformat)
            .then(responseData => {
            console.log(" Search LIST Data Here");
            search_list_data = "";
            console.log(responseData)
            // Proceed only if its the valid data
            if(responseData.message == "success"){
            list_authors = responseData.list_authors;
            list_descriptions = responseData.list_descriptions;
            list_titles = responseData.list_titles;
            list_images = responseData.list_images;
            list_links = responseData.list_links;
            list_dates = responseData.list_dates;
            list_sources = responseData.list_sources;
            let length = responseData.length;
            // If no Elements, just display No Results.
            if (length==0){
            let nResults = "No results";
            document.getElementById("right-bottom").innerHTML = `<div align="center"><p>${nResults}</p></div>`;
            }
            // If number of elements is less than 5
            else if (length<=5){
                max_size = 8;
                for(slist=0;slist<length;slist++){
                    const array = list_descriptions[slist].trim().split(' ');
                    const ellipsis = array.length > max_size ? '...' : '';
                    let newarray = array.slice(0, max_size).join(' ') + ellipsis;
                    search_list_data += `<div class="wrapper">
                                            <button style="position:absolute;top:30px;right:3px;height:20px;width:20px;z-index:1;border:none;display:none;background-color:#ececec;"><span class="close">X</span></button>
                                            <button type="button" class="NewsListCollapsible">
                                              <img src="${list_images[slist]}" height="70px" width="70px">
                                              <div class="text">
                                                 <ul>
                                                       <p style="font-size:14px;font-weight:bold;margin-left:6px;margin-top:0px;">${list_titles[slist]}</p>
                                                       <li class="hide"><b>Author:</b>${list_authors[slist]}</li>
                                                       <li class="hide"><b>Source:</b>${list_sources[slist]}</li>
                                                       <li class="hide"><b>Date:</b>${list_dates[slist]}</li>
                                                       <p style="font-size:12px;margin-left: 6px" id="desc-line" class="show">${newarray}</p>
                                                   </ul>
                                              </div>
                                              <div class="information" >
                                                   <ul>
                                                       <p>${list_descriptions[slist]}</p>
                                                       <a href="${list_links[slist]}" target="_blank">see original post</a>
                                                   </ul>
                                              </div>
                                              </button>
                                          </div>`
                    }
                document.getElementById("right-bottom").innerHTML = search_list_data;
                }
            // If number of elements is more, we have to add show more button and display
            else{
            max_size = 8;
            search_list_data += `<div class="permanent">`
            for(slist=0;slist<5;slist++){
                const array = list_descriptions[slist].trim().split(' ');
                const ellipsis = array.length > max_size ? '...' : '';
                let newarray = array.slice(0, max_size).join(' ') + ellipsis;
                search_list_data += `<div class="wrapper">
                                        <button style="position:absolute;top:30px;right:3px;height:20px;width:20px;z-index:1;border:none;display:none;background-color:#ececec;"><span class="close">X</span></button>
                                        <button type="button" class="NewsListCollapsible">
                                          <img src="${list_images[slist]}" height="70px" width="70px">
                                          <div class="text">
                                             <ul>
                                                   <p style="font-size:14px;font-weight:bold;margin-left:6px;margin-top:0px;">${list_titles[slist]}</p>
                                                   <li class="hide"><b>Author:</b>${list_authors[slist]}</li>
                                                   <li class="hide"><b>Source:</b>${list_sources[slist]}</li>
                                                   <li class="hide"><b>Date:</b>${list_dates[slist]}</li>
                                                   <p style="font-size:12px;margin-left: 6px" id="desc-line" class="show">${newarray}</p>
                                               </ul>
                                          </div>
                                          <div class="information" >
                                               <ul>
                                                   <p>${list_descriptions[slist]}</p>
                                                   <a href="${list_links[slist]}" target="_blank">see original post</a>
                                               </ul>
                                          </div>
                                          </button>
                                      </div>`
                }
                search_list_data += `</div>`;
                search_list_data += `<div><button type="button" class="more" id="more-btn">Show More</button></div>`;
                search_list_more = "";
                // Show More Data
                if (length>15){
                        search_list_more += `<div class="showMoreData" style="display:none;">`
                        for(slist=5;slist<15;slist++){
                                const array = list_descriptions[slist].trim().split(' ');
                                const ellipsis = array.length > max_size ? '...' : '';
                                let newarray = array.slice(0, max_size).join(' ') + ellipsis;
                                console.log(newarray)
                                search_list_more += `<div class="wrapper">
                                            <button style="position:absolute;top:30px;right:3px;height:20px;width:20px;z-index:1;border:none;display:none;background-color:#ececec;"><span class="close">X</span></button>
                                            <button type="button" class="NewsListCollapsible">
                                              <img src="${list_images[slist]}" height="70px" width="70px">
                                              <div class="text">
                                                 <ul>
                                                       <p style="font-size:14px;font-weight:bold;margin-left:6px;margin-top:0px;">${list_titles[slist]}</p>
                                                       <li class="hide"><b>Author:</b>${list_authors[slist]}</li>
                                                       <li class="hide"><b>Source:</b>${list_sources[slist]}</li>
                                                       <li class="hide"><b>Date:</b>${list_dates[slist]}</li>
                                                       <p style="font-size:12px;margin-left: 6px" id="desc-line" class="show">${newarray}</p>
                                                   </ul>
                                              </div>
                                              <div class="information" >
                                                   <ul>
                                                       <p>${list_descriptions[slist]}</p>
                                                       <a href="${list_links[slist]}" target="_blank">see original post</a>
                                                   </ul>
                                              </div>
                                              </button>
                                          </div>`
                                          }
                        search_list_more += `</div>`
                        // Add show less Button
                        search_list_more += `<div><button type="button" class="show-less" id="less-btn">Show Less</button></div>`;
                        }
                    else{
                        search_list_more += `<div class="showMoreData" style="display:none;">`
                        for(slist=5;slist<length;slist++){
                                const array = list_descriptions[slist].trim().split(' ');
                                const ellipsis = array.length > max_size ? '...' : '';
                                let newarray = array.slice(0, max_size).join(' ') + ellipsis;
                                console.log(newarray)
                                search_list_more += `<div class="wrapper">
                                            <button style="position:absolute;top:30px;right:3px;height:20px;width:20px;z-index:1;border:none;display:none;background-color:#ececec;"><span class="close">X</span></button>
                                            <button type="button" class="NewsListCollapsible">
                                              <img src="${list_images[slist]}" height="70px" width="70px">
                                              <div class="text">
                                                 <ul>
                                                       <p style="font-size:14px;font-weight:bold;margin-left:6px;margin-top:0px;">${list_titles[slist]}</p>
                                                       <li class="hide"><b>Author:</b>${list_authors[slist]}</li>
                                                       <li class="hide"><b>Source:</b>${list_sources[slist]}</li>
                                                       <li class="hide"><b>Date:</b>${list_dates[slist]}</li>
                                                       <p style="font-size:12px;margin-left:6px;display:block;" id="desc-line" class="show">${newarray}</p>
                                                   </ul>
                                              </div>
                                              <div class="information" >
                                                   <ul>
                                                       <p>${list_descriptions[slist]}</p>
                                                       <a href="${list_links[slist]}" target="_blank">see original post</a>
                                                   </ul>
                                              </div>
                                              </button>
                                          </div>`
                               }
                        search_list_more += `</div>`
                               // Add show less Button
                        search_list_more += `<div><button type="button" class="show-less" id="less-btn">Show Less</button></div>`;
                          }



                document.getElementById("right-bottom").innerHTML = search_list_data;
                document.getElementById("right-bottom").innerHTML += search_list_more;
                document.getElementById("more-btn").addEventListener("click", function() {
	                this.style.display = "none";
	                document.getElementsByClassName("showMoreData")[0].style.display = "block";
	                document.getElementById("less-btn").style.display = "block";
                 });
                document.getElementById("less-btn").addEventListener("click", function() {
                     this.style.display = "none";
                     document.getElementsByClassName("showMoreData")[0].style.display = "none";
                     document.getElementById("more-btn").style.display = "block";
                    });
            }
            // EVENT HANDLERS
            let childNodeCounter = 0;
                // Handling Search Cards
                    // Close button handlers
                    // ------------------------------------------------------------------------------------------------
                    var closebtns = document.getElementsByClassName("close");
                    var i;

                    for (i = 0; i < closebtns.length; i++) {
                      closebtns[i].addEventListener("click", function() {
                        let x = this.parentElement;
                        let y = x.parentElement;
                        let buttonC = y.childNodes[3]; // NewsListCollapsible

                        let closeBtnC = buttonC.parentElement.childNodes[1];
                        if (closeBtnC.style.display === "block"){
                                closeBtnC.style.display = "none";
                            }

                        let centerTextDivC = buttonC.childNodes[3];
                        let centerTextulC = centerTextDivC.childNodes[1];

                        let descC = centerTextulC.childNodes[centerTextulC.childNodes.length-2]
                        descC.style.display = "block";

                       for(n=0;n<centerTextulC.childNodes.length;n++){
                        if(centerTextulC.childNodes[n].nodeName == "LI"){
                                centerTextulC.childNodes[n].style.display = "none";

                        var contentC = buttonC.lastElementChild
                        contentC.style.display = "none";
                        }
                      }

                    });
                }

                    // Collapsible Handlers
                    var coll = document.getElementsByClassName("NewsListCollapsible");
                    var i;
                    for (i = 0; i < coll.length; i++) {
                      coll[i].addEventListener("click", function() {
                        this.classList.toggle("active");

                        let closeBtn = this.parentElement.childNodes[1];
                        if (closeBtn.style.display === "none"){
                                closeBtn.style.display = "block";
                            }

                        let centerTextDiv = this.childNodes[3];
                        let centerTextUL = centerTextDiv.childNodes[1];

                    // Removing description from the main
                        let desc = centerTextUL.childNodes[centerTextUL.childNodes.length-2]
                        desc.style.display = "none";


                       for(m=0;m<centerTextUL.childNodes.length;m++){
                        if(centerTextUL.childNodes[m].nodeName == "LI"){
                                centerTextUL.childNodes[m].style.display = "block";
                        }
                       }


                        // Displaying the underlying content

                        var content = this.lastElementChild
                        content.style.display = "block";
                      });
                    }
                }else{
                alert(responseData.message);
                }

            })
            .catch(err => {
                console.log("In error");
                console.log(err);
        });
    }
}
    sendDataSearchPage();
    return false;
}


// HOMEPAGE

function loadHomepage(){
    // Search Page Function
    let changeValue = 1; // To control the Image Slider
    const changeSearch = function(){
        // alert("hello")
        document.getElementById("src-btn").style.backgroundColor = "#555555";
        document.getElementById("src-btn").style.color = "white";
        document.getElementById("gnews-btn").style.backgroundColor = "#f3f3f3";
        document.getElementById("gnews-btn").style.color = "black";
        // Adding Default Date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        //today = mm + '/' + dd + '/' + yyyy;
        today = yyyy + "-" + mm + "-" + dd;

        var days = 7;
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        var day = String(last.getDate()).padStart(2, '0');
        var month= String(last.getMonth()+1).padStart(2, '0');
        var year=last.getFullYear();
        previous = year + '-' + month + '-' + day;
        // Load the top-middle with the search form  value="${previous}"
        search_form = ""
        document.getElementById("right-top").style ="background-color:#f3f3f3;height:160px;margin-top:7px;position:relative;"
        console.log(i_sources);
        src_options = i_sources;
//        source_options_v = "<option>all<option>";
//        for(so=0;so<10;so++){
//        console.log(src_options[so])
//        if(src_options[so].length == 0){
//        continue
//        }else{
//            source_options_v+=`<option>${src_options[so]}<option><br>`;
//            }
//        }
        search_form += `<form style="padding-top:20px;" id="searchForm" method="get" onsubmit="return loadSearchPage();">
                            &nbsp;&nbsp;&nbsp;<label for="key-word" class="mandatory">Keyword</label>&nbsp;&nbsp;
                            <input id="key-word" type="text" name="keyword" autofocus required/>&nbsp;&nbsp;&nbsp;
                            <label for="from-date" class="mandatory">From</label>&nbsp&nbsp;
                            <input id="from-date" type="date" name="fromdate" value="${previous}" required/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <label for="to-date" class="mandatory">To</label>&nbsp&nbsp;
                            <input id="to-date" type="date" name="todate" value="${today}" required/> <br><br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label for="slt-category" >Category</label>&nbsp;&nbsp;<select id="slt-category" class="dropdownCS" name="category">
                                <option>all</option>
                                <option>business</option>
                                <option>entertainment</option>
                                <option>general</option>
                                <option>health</option>
                                <option>science</option>
                                <option>sports</option>
                                <option>technology</option>
                            </select>
                            &nbsp;&nbsp;&nbsp;&nbsp;<label for="slt-source">Source</label>&nbsp;&nbsp;<select id="slt-source" class="dropdownCS" name="source">
                            <option>all</option>
                            <option>${src_options[0]}</option>
                            <option>${src_options[1]}</option>
                            <option>${src_options[2]}</option>
                            <option>${src_options[3]}</option>
                            <option>${src_options[4]}</option>
                            <option>${src_options[5]}</option>
                            <option>${src_options[6]}</option>
                            <option>${src_options[7]}</option>
                            <option>${src_options[8]}</option>
                            <option>${src_options[9]}</option>
                            </select>
                                <br><br>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" class="btn-search" id="searchResult" value="Search"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="reset" value="Clear" class="btn-reset" id="reset-search">
                                <input id="submit_hidden" type="submit" style="display:none">
                        </form>`;

        document.getElementById("right-top").innerHTML = search_form;
        document.getElementById("right-bottom").innerHTML = "";
        document.getElementById('key-word').focus()
        document.getElementById("right-top").style.borderRadius = "5px";
        document.getElementById('reset-search').addEventListener('click', function(){
            document.getElementById("right-bottom").innerHTML = "";
            document.getElementById("slt-source").innerHTML = `<option>all</option>
                            <option>${src_options[0]}</option>
                            <option>${src_options[1]}</option>
                            <option>${src_options[2]}</option>
                            <option>${src_options[3]}</option>
                            <option>${src_options[4]}</option>
                            <option>${src_options[5]}</option>
                            <option>${src_options[6]}</option>
                            <option>${src_options[7]}</option>
                            <option>${src_options[8]}</option>
                            <option>${src_options[9]}</option>`

        });
        document.getElementById("slt-category").addEventListener("change", function(){
            categorySel = document.getElementById('searchForm').category.options
            selectedCategoryValue = categorySel[document.getElementById('searchForm').category.options.selectedIndex].value
            // alert(selectedCategoryValue)
            // Fetching the Sources from the backend and updating it here
                    dataForSources = {page:"sources",category:selectedCategoryValue}
                    urlformatsources = '/fetchsearch' + '?page=sources&category=' + selectedCategoryValue;
                    loadXMLDocGET('GET',urlformatsources)
                    .then(responseData => {
                    console.log(" Sources Data Here- GET METHOD");
                    console.log(responseData)
                    let responseDataSources = responseData.sources
                    sources_list = `<option>all</option>`;
                    if (responseDataSources.length <= 10){
                        for(s=0; s<responseDataSources.length;s++){
                        sources_list += `<option>${responseDataSources[s]}</option>`
                        }
                    }
                    else{
                        for(s=0; s<10;s++){
                        sources_list += `<option>${responseDataSources[s]}</option>`
                        }
                    }
                    document.getElementById("slt-source").innerHTML = sources_list;
                })
                .catch(err => {
                    console.log("In error");
                    console.log(err);
                });
        });
        // Search Results handling
        // document.getElementById("searchResult").addEventListener('click',loadSearchPage);
        changeValue = 0;
        // return false;
    };

    const changeGoogleNews = function(){
    document.getElementById("middle-seg").innerHTML = `<!-- News Slider and Word Cloud -->
        <div id="right-top" style="background-color:white;height:200px;margin-top:7px;position:relative;"><br>
            <!-- 2 Divs, one floating next to another -->
            <!-- Slider -->
            <div class="slider-left">
                <a href="" id="news-link" target="_blank"><span class="span-link"></span></a>
                <img name="slider" style="height:100%;width:100%;" src="">
                    <div class="textImg">
                        <h1 id="headline"></h1>
                        <p id="headline-description"></p>
                    </div>
            </div>
            <!-- Word Cloud -->
            <div id="word-cloud">

            </div>
        </div>
        <!-- Main Headlines: CNN, Fox-News -->

        <div id="right-bottom" style="padding-bottom:7px;">
            <!-- Insert Main Headlines here -->
            <h1 style="text-align:center;margin-bottom:0px;">CNN</h1>
            <hr class="dottedLine">
            <div class="cards" id="cnn-news">
                <!-- CNN NEWS -->
            </div>
            <!-- Fox News -->
            <h1 style="text-align:center;margin-bottom:0px;">Fox News</h1>
            <hr class="dottedLine">
            <div class="cards" id="fox-news">

            </div>
        </div>`
        document.getElementById("src-btn").style.backgroundColor = "#f3f3f3";
        document.getElementById("src-btn").style.color = "black";
        document.getElementById("gnews-btn").style.backgroundColor = "#555555";
        document.getElementById("gnews-btn").style.color = "white";
    changeValue = 1;
    sendDataHomepage();
    }

    // Loading XML Function

// ---------------------------- END OF FUNCTIONS -------------------------------------------------------------------

    // JSON data processing..

    const sendDataHomepage = () => {
        loadXMLDocGET('GET','/getnews')
        .then(responseData => {
        console.log("Data Here");
        console.log("Called from GET")
        console.log(responseData);
            // Functions
            function draw(words) {
                   svg
                  .append("g")
                  .attr("transform", "translate(" + (widthWC-20) / 2 + "," + (heightWC-10) / 2 + ")")
                  .selectAll("text")
                  .data(words)
                  .enter().append("text")
                  .style("font-size", function(d) { return d.size+ "px"; })
                  .style("fill", "black")
                  .attr("text-anchor", "middle")
                  .style("font-family", "Impact")
                  .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                  .text(function(d) { return d.text; });
                }

             // Image Slider function
            function imageSlide(){
            if (changeValue == 1){
                document.slider.src = imgArray[imageIndex];
                document.getElementById("headline").innerHTML = titleArray[imageIndex];
                document.getElementById("news-link").href = imgLink[imageIndex];
                let titleDescription = document.getElementById("headline-description");
                titleDescription.innerHTML = descriptionArray[imageIndex];
                if (imageIndex < 4){
                        imageIndex++;
                        }
                else if(imageIndex==4){
                        imageIndex = 0;
                        }
                if (changeValue == 1){
                console.log(changeValue)
                setTimeout(imageSlide,time);
                }
                }
                }

        // END OF FUNCTIONS
        // Variables
        //-------------------------------------IMAGE SLIDER-----------------------------------------------------
        imageIndex = 0;
        let time = 1500;
        console.log(responseData.slider_images)
        let imgLink = responseData.slider_urls;
        let imgArray = responseData.slider_images;
        let descriptionArray = responseData.slider_descriptions;
        let titleArray = responseData.slider_titles;
        imageSlide();
        i_sources = responseData.initial_sources;
        // CNN Data Arrays
        let cnnImgLink = responseData.cnn_urls;
        let cnnImgArray = responseData.cnn_images;
        let cnnDescriptionArray = responseData.cnn_descriptions;
        let cnnTitleArray = responseData.cnn_titles;
        // Populate CNN divs
                cnn_news_html = "";
                for(cnn_i=0;cnn_i<4;cnn_i++){
                    cnn_news_html += `<a class="newsCard" style="display:block; text-decoration:None;text-color=black;" href="${cnnImgLink[cnn_i]}" target="_blank">
                                            <img src="${cnnImgArray[cnn_i]}" style="width:100%;height:130px; border-radius:5px 5px 0 0">
                                            <div class="newsCardDescription">
                                                <h4 style="text-align:center;color:black;font-family:Georgia"><b>${cnnTitleArray[cnn_i]}</b></h4>
                                                <p style="font-size:13px;color:black;font-family:Georgia">${cnnDescriptionArray[cnn_i]}</p>
                                            </div>
                                      </a>`
                }
                document.getElementById("cnn-news").innerHTML = cnn_news_html


        // Fox-news Data Arrays
        let foxImgLink = responseData.fox_urls;
        let foxImgArray = responseData.fox_images;
        let foxDescriptionArray = responseData.fox_descriptions;
        let foxTitleArray = responseData.fox_titles;
        // Populate FOX divs
                fox_news_html = "";
                for(fox_i=0;fox_i<4;fox_i++){
                    fox_news_html += `<a class="newsCard" style="display:block; text-decoration:None;text-color=black;" href="${foxImgLink[fox_i]}" target="_blank">
                                            <img src="${foxImgArray[fox_i]}" style="width:100%;height:130px; border-radius:5px 5px 0 0">
                                            <div class="newsCardDescription">
                                                <h4 style="text-align:center;color:black;font-family:Georgia"><b>${foxTitleArray[fox_i]}</b></h4>
                                                <p style="font-size:13px;color:black;font-family:Georgia">${foxDescriptionArray[fox_i]}</p>
                                            </div>
                                      </a>`
                }
                document.getElementById("fox-news").innerHTML = fox_news_html


        // To calculate the width of the div, where we have to place the word cloud
                widthWC =  document.getElementById("word-cloud").clientWidth;
                heightWC =  document.getElementById("word-cloud").clientHeight;

                // Word Cloud
                // List of words -- JSON

                //var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "10"}, {word: "Kiting", size: "20"}, {word: "Sailing", size: "30"}, {word: "Snowboarding", size: "15"},{word: "Snow", size: "15"},{word: "boarding", size: "30"},{word: "Basket", size: "15"},{word: "Basketball", size: "15"},{word: "Lebron", size: "15"} ]
                var myWords = responseData.words_list;
                // console.log(myWords);
                // set the dimensions and margins of the graph
                var margin = {top: 15, right: 15, bottom: 15, left: 15},
                width = widthWC - margin.left - margin.right,
                height = heightWC - margin.top - margin.bottom;

                // append the svg object to the body of the page
                var svg = d3.select("#word-cloud")
                .append("svg")
                .attr("width", widthWC-6)
                .attr("height", heightWC)
                .append("g")
                .attr("transform", "translate(" + (margin.left-14) + "," + (margin.top-5) + ")");

                // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
                // Wordcloud features that are different from one word to the other must be here
                var layout = d3.layout.cloud()
                .size([widthWC, heightWC])
                .words(myWords.map(function(d) {return {text: d.word, size:d.size};}))
                .padding(6)        //space between words
                .rotate(function() { return ~~(Math.random() * 2) * 90;})
                .fontSize(function(d){ return d.size;})
                .on("end", draw);
                layout.start();
        })
        .catch(err => {
            console.log("In error");
            console.log(err);
        });
    };
    sendDataHomepage();
    let chg = document.getElementById("src-btn").addEventListener('click',changeSearch);
    let rld = document.getElementById("gnews-btn");
    let x = rld.addEventListener('click', changeGoogleNews);


}