import Search from './models/search';
import {elements,renderLoader,clearLoader} from './views/base';
import * as searchView from './views/searchViews';
import Recipe from './models/Recipe';
import * as recipeView from './views/RecipeView';
import * as listView from './views/ListView';
import List from './models/List';
import Likes from './models/likes';
import * as likesView from './views/likesView'
/**Global  state of the controller
 *Search Object 
 *Current recipe object
 *Shopping list object
 *Liked recipes
 **/
//Search Controller
const state={};
window.state=state;
const controlSearch=async ()=> {
    //1. get query from view
    const query = searchView.getInput();
    //console.log(query);
    if(query){
        //2. New search object and add to the state
        state.search = new Search(query);
        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.SearchRes);
        
        //4. Search for recipes
      await state.search.getResults();
        //5.Render results on UI
        console.log(state.search.result);
        searchView.renderresults(state.search.result);
        clearLoader();
    }
}

     elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});
elements.SearchResPages.addEventListener('click',e=>{
    console.log(e.target);
    const btn=e.target.closest('.btn-inline');
    console.log(btn);
    if(btn){
        const goToPage=parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderresults(state.search.result,goToPage);
        console.log(goToPage);
    }
});
//RECIPE CONTROLLER
/*const r=new Recipe(46956);
r.getRecipe();
console.log(r);*/
const controlRecipe=async () => {
    
    //Get ID from the URL
    const id=window.location.hash.replace('#','');
    //console.log(id);
    if(id){
        //Prepare UI for the changes
        recipeView.clearRecipe();
       renderLoader(elements.recipe);
       //Highlight selected search item
       if(state.search)searchView.highlightSelected(id);
        //create new recipe object
       state.recipe=new Recipe(id);
       //testing
      // window.r=state.recipe;
       try{
        //Get recipe data and parseIng
       await state.recipe.getRecipe();
       state.recipe.parseIngredients();
       //console.log(state.recipe.ingredients);
        //calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServing();
        //renderRecipe
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );
        
       }catch(error){
          alert(error);
       }
    }
};
//List controller
const controlList=()=>{
    //create a new list if there is none yet
    if(!state.list) state.list= new List();

    //Add each ingredient to the list
    //console.log(state.recipe.ingredients);
    state.recipe.ingredients.forEach(el=>{
       const item = state.list.addItem(el.count,el.unit,el.ingredient);
       listView.renderItem(item);
    });
    endstats();
}
//window.addEventListener('hashchange',controlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));
/**
 * Like Controller
 */


const controlLike=()=>{
    if(!state.likes)state.likes=new Likes();
    const currentID=state.recipe.id;
    //user hasnt changed current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike=state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img);
            //Toggle the like button
            likesView.toggleLikeBtn(true);
            //Add like to the UI list
            likesView.renderLike(newLike);
            console.log(state.likes);
            //user has liked the current recipe


    }else{
        //remove the like from the state
        state.likes.deleteLiked(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};
//handle delete and update list events
elements.shopping.addEventListener('click',e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle delete button
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //delete  from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
        //Handle the count update
     } else if(e.target.matches('.shopping__count-value')){
         const val=parseFloat(e.target.value,10);
         state.list.updateCount(id,val);
     }
    
});
//restore liked recipes on page load
window.addEventListener('load',()=>{
state.likes=new Likes();
//restore likes
state.likes.readStorage();
//toggle like menu button
likesView.toggleLikeMenu(state.likes.getNumLikes());
//render the existing likes
state.likes.likes.forEach(like=>likesView.renderLike(like));

});

//handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        if(state.recipe.servings>1){
        //decrease button is clicked
        state.recipe.updateServing('dec');
        console.log('-')}
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.btn-increase,.btn-increase *')){
    //increase btn is clicked
    console.log('+')
    state.recipe.updateServing('inc');
    recipeView.updateServingsIngredients(state.recipe);
} else if(e.target.matches('.recipe__btn-add, .recipe__btn--add *')){
    //Add ingredients to shopping list
    controlList();
} else if(e.target.matches('.recipe__love,.recipe__love *')){
//console.log(state.recipe);
    //Like controller
    controlLike();
};
});
