import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDMzO-eHaDr8yTsHz93-zLvK8VSUtf9L7o',
  authDomain: 'blog-f3083.firebaseapp.com',
  projectId: 'blog-f3083',
  storageBucket: 'blog-f3083.firebasestorage.app',
  messagingSenderId: '49491162254',
  appId: '1:49491162254:web:89a2ef7a60ccff81d685df',
  measurementId: 'G-XWL80RYTTN',
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
