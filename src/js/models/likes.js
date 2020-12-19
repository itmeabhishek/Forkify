export default class Likes{
    constructor(){
        this.likes=[];
    }
    addLike(id,title,author,img){
        const like={id,title,author,img};
        this.likes.push(like);
        //persist data in local storage
        this.persistData();
        return like;
    }
    deleteLiked(id){
        const index=this.likes.findIndex(el=>el.id===id)
        //persist data in local storage
        this.persistData();
        this.likes.splice(index,1);
    }
    isLiked(id){
        return this.likes.findIndex(el=>el.id===id) !==-1;
    }
    getNumLikes(){
        return this.likes.length;
    }
    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }
    readStorage(){
        const storage=JSON.parse(localStorage.getItem('likes'));
        //restoring data from local storage
        if(storage)this.likes=storage;
    }
}
