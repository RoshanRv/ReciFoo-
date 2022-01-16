let item=document.getElementById('item')
let items=document.getElementById('items')
let searchBtn=document.getElementById('searchBtn')
let search=document.getElementById('search')
let fav=document.getElementById('fav')
let recipeInfo=document.getElementById('recipeInfo')
let reci=document.getElementById('reci')
let head=document.getElementById('head')
let alpha=document.getElementById('alpha')
let cat=document.getElementById('cat')

const reload=()=>{
    location.reload()
}

// Fetching Function
const randomMeal=async ()=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const data = await resp.json()
    const meal = data.meals[0]
    // console.log(meal)

    return meal
}
const idMeal=async (id)=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id)
    const data = await resp.json()
    const meal = data.meals[0]
    // console.log(meal)

    return meal
}
const nameMeal=async (name)=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+name)
    const data = await resp.json()
    const meal = data.meals
    // console.log(meal)

    return meal
}

const regionMeal=async (region)=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a='+region)
    const data = await resp.json()
    const meal = data.meals
    // console.log(meal)

    return meal
}

const alphabetMeal=async (alphabet)=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f='+alphabet)
    const data = await resp.json()
    const meal = data.meals
    // console.log(meal)

    return meal
}

const fetchCategories=async()=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
    const data = await resp.json()
    const meal = data.meals
    // console.log(meal)

    return meal

}

const getCategories=async(cat)=>{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c='+cat)
    const data = await resp.json()
    const meal = data.meals
    // console.log(meal)

    return meal

}




const fetchSearchMeals=async()=>{
    try{
            let searchTerm = search.value
        const meals = await nameMeal(searchTerm)
        item.innerHTML=''
        meals.map((meal)=>{
            for(i of favMeals){
                if(meal.idMeal==i){
                    return displayMeals(meal,false,true)
                }
            } 
            return displayMeals(meal)
        })
    }catch(error){
        item.innerHTML=`<h1 class='mt-4 text-xl md:text-2xl lg:text-3xl no break-words text-center' >No Results Found for '${search.value}'</h1>`
    }
    
}

const displayMeals=(mealData,random=false,fav=false,region=undefined,alphabet=undefined,category=undefined)=>{
    let mealContainer = document.createElement('div',)
    !random && item.classList.add('md:grid-cols-2')
    mealContainer.classList.add('shadow-lg','p-4','my-4','rounded-xl','relative','bg-indigo-500','border-2','border-white','hover:bg-indigo-600','transition-all')
    mealContainer.id ='recipe'
    mealContainer.setAttribute('data',mealData.idMeal)
    head.innerHTML='Foods'
    region && (head.innerHTML=`${region} Foods`)
    alphabet && (head.innerHTML=`Foods Starts with '${alphabet}' `)
    category && (head.innerHTML=`${category} Dishes `)
    mealContainer.innerHTML =`${random ? '<span class="absolute text-lg bg-black border-2  border-white px-4 py-1 pl-6  top-6">Recommendation</span>': ''}
                        <div class='overflow-hidden border-2 border-white rounded-lg'>
                        <img id='recipe' data=${mealData.idMeal} src=${mealData.strMealThumb} alt=${mealData.strMeal} class="w-60 scale transition-all md:w-76 lg:w-96 cursor-pointer ">
                        </div>
                        <div id='recipe' data=${mealData.idMeal} class="flex justify-between items-center cursor-pointer py-3">
                            <h2 id='recipe' data=${mealData.idMeal} class="text-xl w-56 break-words cursor-pointer">${mealData.strMeal}</h2>
                            <button id="favBtn"><i class="fas fa-heart fa-lg ${fav?'fas text-red-400':''}" id="favBtn" data=${mealData.idMeal}></i></button>
                        </div>`
    item.appendChild(mealContainer)

    window.scrollTo({
        top: 100,
        left: 0,
        behavior: 'smooth'
      });


    
}

const displayRandomMeal=async()=>{
    const meal = await randomMeal()
    for(i of favMeals){
        if(meal.idMeal==i)return displayMeals(meal,true,true)
    }
    return displayMeals(meal,true)
    
}





let favMeals = []
const addFav=(mealId)=>{
    localStorage.setItem('favMeal',JSON.stringify([...favMeals ,mealId]))
    getFav()
}
const removeFav=(mealId)=>{
    localStorage.setItem('favMeal',JSON.stringify(favMeals.filter((meal)=>meal!==mealId)))
    getFav()
}

const getFav=()=>{
    favMeals=[]
    let meal = JSON.parse(localStorage.getItem('favMeal'))
    meal&&favMeals.push(...meal)
    fetchFavDetails()
}

const fetchFavDetails=async()=>{
    fav.innerHTML =''
    for(i of favMeals){
        let meal = await idMeal(i)
        dispFav(meal)
    }
}

const dispFav =(mealData)=>{
    let favItems = document.createElement('div')
    favItems.classList.add('flex-shrink-0', 'w-40',  'text-ellipsis' , 'text-center', 'py-4')
    favItems.id ='recipe'
    favItems.setAttribute('data',mealData.idMeal)
    favItems.innerHTML=`<div  class="relative w-max ">
                        <div class='overflow-hidden rounded-full border-4 border-black'>
                        <img id='recipe' data=${mealData.idMeal} src=${mealData.strMealThumb} alt=${mealData.strMeal} class="w-38 h-28 md:w-46 md:h-40 flex-shrink-0 cursor-pointer scale transition-all "></div>
                        <i id='close' data=${mealData.idMeal} class="fas fa-times-circle fa-lg absolute top-2 right-0 md:right-4 text-white cursor-pointer"></i></div>
                        <span id='recipe' data=${mealData.idMeal} class="w-8 cursor-pointer">${mealData.strMeal}</span>`
    fav.appendChild(favItems)
}


const dispRecipe=async(meal)=>{
    let mealData = await idMeal(meal)
    reci.innerHTML=''
    recipeInfo.className = 'w-full w fixed bottom-0  bg top-0'
    infoMeal = document.createElement('div')
    infoMeal.className='bg-indigo-500 hover:bg-indigo-600 trainsition-all border-2 md:border-4 z-50 w-full h-max rounded-xl shadow-lg p-6 lg:p-10 relative'
    listItems = dispIngred(mealData)
    infoMeal.innerHTML=`<h1 class="text-center pb-4 pt-2 text-xl md:text-2xl lg:text-3xl font-md">${mealData.strMeal}</h1>
                        <img src=${mealData.strMealThumb} alt=${mealData.strMeal} class='mx-auto rounded-xl shadow-xl border-2'>
                        <h1 class="text-center mt-6 mb-4 text-xl  md:text-2xl lg:text-3xl font-md">Recipe</h1>
                        <p class='text-md md:text-lg  para lg:text-xl' >${mealData.strInstructions}</p>
                        <h1 class="text-center my-4 text-xl md:text-2xl lg:text-3xl font-md">Ingredients</h1>
                        <i  class="fas fa-times-circle fa-lg absolute top-4 right-6 md:right-4 text-black cursor-pointer" onclick='closeReci()' ></i></div>
                        <div class='w-max mx-auto'>
                        <ul class='list-disc'>
                            ${listItems.innerHTML}
                        </ul>
                        </div>
                        `
                        
    reci.appendChild(infoMeal)

}

const dispIngred = (mealData)=>{
    const list= document.createElement('ul')
    list.className='text-center mx-auto'
    for(let i=1;i<=20;i++){
        if(mealData['strIngredient'+i]){
            const listEl = document.createElement('li')
            listEl.className='text-md md:text-lg lg:text-xl'
            data =  mealData['strIngredient'+i]+'  '+' - '+'  '+ mealData['strMeasure'+i]
            listEl.innerHTML=data
            list.appendChild(listEl)
        }        
    }
    return list
}

const closeReci=()=>{
    recipeInfo.classList.add('hidden')
}

const dispRegionMeal = async (region)=>{

    try{
        const mealData = await regionMeal(region)
        item.innerHTML=''
        mealData.map((meal)=>{
            for(i of favMeals){
                if(i==meal.idMeal)return displayMeals(meal,false,true,region)
            }
            return displayMeals(meal,false,false,region)
        })
    }catch(error){
        item.innerHTML=`<h1 class='mt-4 text-xl md:text-2xl lg:text-3xl no break-words text-center' >No Food Found in '${region}'</h1>`
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
          });
    }
    
}

const dispAlphabetMeal = async (alphabet)=>{

    try{
        const mealData = await alphabetMeal(alphabet)
        item.innerHTML=''
        mealData.map((meal)=>{
            for(i of favMeals){
                if(i==meal.idMeal)return displayMeals(meal,false,true,false,alphabet)
            }
            return displayMeals(meal,false,false,false,alphabet)
        })
    }catch(error){
        item.innerHTML=`<h1 class='mt-4 text-xl md:text-2xl lg:text-3xl no break-words text-center' >No Food Found in '${alphabet}'</h1>`
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
          });

    }
    
}

const displayCategories=(category)=>{
    catItem=document.createElement('div')
    catItem.className=' py-4 rounded-lg shadow-lg md:w-44 w-32 text-center cursor-pointer mt-4 bg-indigo-500 border-2 transition-all  scale hover:bg-indigo-600'
    catItem.id = 'category'
    catItem.setAttribute('data',category.strCategory)
    catItem.innerHTML=`<h1 class='text-md md:text-lg lg:text-xl cursor-pointer h-full' id='category' data=${category.strCategory} >${category.strCategory}</h1>`

    cat.appendChild(catItem)
}

const fetchCategory=async ()=>{
    const categories = await fetchCategories()
    categories.map((category)=>{displayCategories(category)
    })
}

const dispCategory=async(caty)=>{
    try{
        const mealData=await getCategories(caty)
        item.innerHTML=''
        mealData.map((meal)=>{
            for(i of favMeals){
                if(i==meal.idMeal)return displayMeals(meal,false,true,false,false,caty)
            }
            return displayMeals(meal,false,false,false,false,caty)
        })
    }catch(error){
        item.innerHTML=`<h1 class='mt-4 text-xl md:text-2xl lg:text-3xl no break-words text-center' >No Food Found in '${caty} Category'</h1>`
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
          });

    }
    
}



getFav()

displayRandomMeal()

fetchCategory()

// Event Listerners
searchBtn.addEventListener('click',fetchSearchMeals)
search.addEventListener('keypress',(e)=>{
    if(e.key=='Enter')fetchSearchMeals()
})
document.addEventListener('click',(e)=>{
    if(e.target && e.target.id =='favBtn'){
        let mealId = e.target.attributes[2].value
        // e.target.classList.toggle('fas')
        e.target.classList.toggle('text-red-400')
        if(e.target.classList.contains('text-red-400')){
            addFav(mealId)
        }else removeFav(mealId)
        
    }

    else if(e.target && e.target.id=='close'){
        let mealId = (e.target.attributes[1].value)
        removeFav(mealId)
    }
    else if(e.target && e.target.id == 'recipe'){
        let meal = e.target.attributes['data'].value
        dispRecipe(meal)

    }else if(e.target && e.target.id =='flag'){
        let region = e.target.attributes['data'].value
        dispRegionMeal(region)
    }else if(e.target && e.target.id =='alpha'){
        let alphabet = e.target.innerHTML
        dispAlphabetMeal(alphabet)
    }
    else if(e.target && e.target.id=='category'){
        const caty= e.target.attributes['data'].value
        dispCategory(caty)
    }
        
})
