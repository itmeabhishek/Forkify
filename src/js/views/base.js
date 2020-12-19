export const elements={
    searchForm:document.querySelector('.search'),
    searchInput:document.querySelector('.search__field'),
    SearchResList:document.querySelector('.results__list'),
    SearchRes:document.querySelector('.results'),
    SearchResPages:document.querySelector('.results__pages'),
    recipe:document.querySelector('.recipe'),
    shopping:document.querySelector('.shopping__list'),
    likesMenu:document.querySelector('.likes__field'),
    likesList:document.querySelector('.likes__list'),
    end:document.querySelector('.results'),
    };
export const elementstring = {
    loader:'loader'
};
export const renderLoader=parent=>{
    const Loader=`
    <div class="${elementstring.loader}">
    <svg>
    <use href = "img/icons.svg#icon-cw"></use>
    </svg>
    </div>`;
    parent.insertAdjacentHTML('afterbegin',Loader);
};
export const clearLoader=()=>{
    const Loader=document.querySelector(`.${elementstring.loader}`);
    if(Loader) Loader.parentElement.removeChild(Loader);
}