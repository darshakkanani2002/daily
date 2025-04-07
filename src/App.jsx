import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './component/Sidebar'
import Header from './component/Header'
import Language from './component/pages/Language'
import Category from './component/pages/Category'
import Post from './component/pages/post/Post'
import Banner from './component/banner/Banner'
import Reels from './component/reels/Reels'
import Font from './component/font/Font'
import FrameColor from './component/framecolor/FrameColor'
import Background from './component/background/Background'
import UpcomingEvent from './component/upcomingevent/UpcomingEvent'
import HomeCategory from './component/homecategory/HomeCategory'
import HomePost from './component/homepost/HomePost'
import BussinessCategory from './component/bussiness/BussinessCategory'
import BussinessSubCategory from './component/bussiness/BussinessSubCategory'
import BussinessPost from './component/bussiness/BussinessPost'

function App() {

  return (
    <div>
      <Router>
        <div className='App'>
          <Sidebar />
        </div>
        <div className='content'>
          <Header></Header>
          <Routes>
            <Route path='/' element={<Language></Language>}></Route>
            <Route path='/category' element={<Category></Category>}></Route>
            <Route path='/post' element={<Post></Post>}></Route>
            <Route path='/banner' element={<Banner></Banner>}></Route>
            <Route path='/reels' element={<Reels></Reels>}></Route>
            <Route path='/font' element={<Font></Font>}></Route>
            <Route path='/framecolor' element={<FrameColor></FrameColor>}></Route>
            <Route path="/background" element={<Background></Background>}></Route>
            <Route path='/upcomingevent' element={<UpcomingEvent></UpcomingEvent>}></Route>
            <Route path='/homecategory' element={<HomeCategory></HomeCategory>}></Route>
            <Route path='/homepost' element={<HomePost></HomePost>}></Route>
            <Route path='/bussinesscategory' element={<BussinessCategory></BussinessCategory>}></Route>
            <Route path='/bussinesssubcategory' element={<BussinessSubCategory></BussinessSubCategory>}></Route>
            <Route path='/bussinesspost' element={<BussinessPost></BussinessPost>}></Route>
          </Routes>
        </div>
      </Router>
    </div >
  )
}

export default App
