import {elements} from './base';
export const highlightSelected=id=>{
    const resultsArr=Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};
export const getInput=()=>elements.searchInput.value;
export const limitRecipeTitle = (title,limit=17)=>{
    if(title.length>limit){
        const newTitle=[];
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length<=limit){
                newTitle.push(cur);
            }
            return acc+cur.length;
        },0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};
const renderRecipes=recipes => {
    const markup=` 
    <li>
    <a class="results__link " href="#${recipes.recipe_id}">
        <figure class="results__fig">
            <img src="${recipes.image_url}" alt="${recipes.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipes.title)}</h4>
            <p class="results__author">${recipes.publisher}</p>
        </div>
    </a>
</li>`;
elements.SearchResList.insertAdjacentHTML('beforeEnd',markup);
};
const createButton=(page,type)=>` 
<button class="btn-inline results__btn--${type}"data-goto=${type==='prev'?page-1:page+1}>
<span>Page${type==='prev'? page-1:page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
    </svg>
   </button>`;
const renderButtons=(page,numResults,resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page===1 && pages>1){
        //Button to go to the next page
        button=createButton(page,'next');
    }
    else if(page<pages){
        //Buttons both
        button=`
        ${createButton(page,'prev')}
        ${createButton(page,'next')}`;
    }
    else if(page===pages && pages>1) {
        //only button to go to the prev page
        button=createButton(page,'prev');
    }
    elements.SearchResPages.insertAdjacentHTML('afterbegin',button)
};

export const renderresults=(recipes,page=1,resPerPage=10)=>{
    //render results of current page
    const start=(page-1)*resPerPage;
    const end=(page)*resPerPage;
    
    recipes.slice(start,end).forEach(renderRecipes);
    //render pagination buttons
    renderButtons(page,recipes.length,resPerPage);

  };
 

export const getResults=(recipes)=>{recipes.forEach(renderRecipes)};
export const clearInput=()=>{elements.searchInput.value=''};
export const clearResults=()=>{
elements.SearchResList.innerHTML='';
elements.SearchResPages.innerHTML=''};

