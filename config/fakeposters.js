const posters = [
  'https://files-cdn.sharenator.com/2835937093_f9bc2f8efd_o-Fake-Movie-Posters-s420x613-65843.jpg',
  'https://1.bp.blogspot.com/_B5-1oeewfB8/THARm8pLAPI/AAAAAAAAL8I/Ey-Y-HDgt80/s1600/wolverine_poster.jpg',
  'https://i.pinimg.com/736x/78/37/c3/7837c3f2dce47e78d78bf246219732f2.jpg',
  'https://laughingsquid.com/wp-content/uploads/2016/03/20055142_590d.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/1.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/2.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/3.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/4.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/5.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/6.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/7.jpg',
  'https://editorial.designtaxi.com/news-sharkmovie2607/8.jpg',
]

const getRandomPosterUrl = () =>
  posters[Math.floor(Math.random() * posters.length)]

module.exports = {
  getRandomPosterUrl,
}
