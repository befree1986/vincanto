export interface GalleryImage {
  src: string;
  altKey: string;
  captionKey?: string;
  captionText?: string;
}

export interface GallerySection {
  titleKey: string;
  mainImage?: GalleryImage;
  images: GalleryImage[];
}

export const galleryData: GallerySection[] = [
  {
    titleKey: 'propriety.gallery.section1.title',
    mainImage: {
      src: '/ingressoNotte/ingresso.jpg',
      altKey: 'propriety.gallery.section1.ingressoNotte.alt',
      
    },
    images: [
      {
        src: '/ingressoNotte/ingresso1.jpg',
        altKey: 'propriety.gallery.section1.image1.alt',
        
      },
      {
        src: '/ingressoNotte/ingresso2.jpg',
        altKey: 'propriety.gallery.section1.image2.alt'
      },

      {
        src: '/ingressoNotte/ingresso2a.jpg',
        altKey: 'propriety.gallery.section1.image3.alt'
      },

      {
        src: '/ingressoNotte/ingresso3.jpg',
        altKey: 'propriety.gallery.section1.image5.alt'
      },
      {
        src: '/corridoio/corridoio.jpg',
        altKey: 'propriety.gallery.section1.image6.alt'
      },
      {
        src: '/corridoio/corridoio2.jpg',
        altKey: 'propriety.gallery.section1.image7.alt'
      },
      {
        src: '/corridoio/corridoio3.jpg',
        altKey: 'propriety.gallery.section1.image8.alt'
      }
    
    ]
  },
  {
    titleKey: 'propriety.gallery.section2.title',
    mainImage: {
      src: '/caneraVerde/verdett.jpg',
      altKey: 'propriety.gallery.section2.mainImage.alt',
      
    },
    
    images: [
      {
        src: '/caneraVerde/verdett.jpg',
        altKey: 'propriety.gallery.section2.img1.alt',
      },
      { src: '/caneraVerde/verde2.jpg',
        altKey: 'propriety.gallery.section2.img2.alt'
      },
      { src: '/caneraVerde/verde3.jpg',
        altKey: 'propriety.gallery.section2.img3.alt'
      },
      { src: '/caneraVerde/verde4.jpg',
        altKey: 'propriety.gallery.section2.img4.alt'
      },
      { src: '/caneraVerde/verde5.jpg',
        altKey: 'propriety.gallery.section2.img5.alt'
      },
      { src: '/cameraBlu/camerablu1.jpg',
        altKey: 'propriety.gallery.section2.img6.alt'
      },
      { src: '/cameraBlu/camerablu2.jpg',
        altKey: 'propriety.gallery.section2.img7.alt'
      },
      { src: '/cameraBlu/camerablu3.jpg',
        altKey: 'propriety.gallery.section2.img8.alt'
      },
      { src: '/cameraBlu/camerablu4.jpg',
        altKey: 'propriety.gallery.section2.img9.alt'
      },
      { src: '/cameraBlu/camerablu5.jpg',
        altKey: 'propriety.gallery.section2.img10.alt'
      },
      { src: '/cameraBlu/camerablu6.jpg',
        altKey: 'propriety.gallery.section2.img11.alt'
      }
    ]
  },

  {titleKey: 'propriety.gallery.section3.title',
    mainImage: {
      src: '/cameraSingola/singolaheader.jpg',
      altKey: 'propriety.gallery.section3.mainImage.alt',
      
    },
    images: [
      {
        src: '/cameraSingola/1_giorno.jpg',
        altKey: 'propriety.gallery.section3.img1.alt',
        
      },
      {
        src: '/cameraSingola/1_notte.jpg',
        altKey: 'propriety.gallery.section3.img2.alt',
      },
      {
        src: '/cameraSingola/2_giorno.jpg',
        altKey: 'propriety.gallery.section3.img3.alt',
      },
      {
        src: '/cameraSingola/2_notte.jpg',
        altKey: 'propriety.gallery.section3.img4.alt',
      }
    
    ]
  },
  {titleKey: 'propriety.gallery.section4.title',
    mainImage: {
      src: '/openSpace/title.jpg',
      altKey: 'propriety.gallery.section4.mainImage.alt',
     },
    images: [
      {
        src: '/openSpace/open1.jpg',
        altKey: 'propriety.gallery.section4.img1.alt',
        
      },
      {
        src: '/openSpace/open2.jpg',
        altKey: 'propriety.gallery.section4.img2.alt',
      },
      {
        src: '/openSpace/open3.jpg',
        altKey: 'propriety.gallery.section4.img3.alt',
      },
      {
        src: '/openSpace/open4a.jpg',
        altKey: 'propriety.gallery.section4.img4.alt',
      },
      {
        src: '/openSpace/open4.jpg',
        altKey: 'propriety.gallery.section4.img5.alt',
      }
    
    ]
  },

  {titleKey: 'propriety.gallery.section5.title',
    mainImage: {
    src: '/bagno1/bagno1.jpg',
    altKey: 'propriety.gallery.section5.mainImage.alt',
  },
    images: [
      {
        src: '/bagno1/bagno1.jpg',
        altKey: 'propriety.gallery.section5.img1.alt',  
      },
      {
        src: '/bagno1/bagno2.jpg',
        altKey: 'propriety.gallery.section5.img2.alt',
      },
      {
        src: '/bagno1/bagno3.jpg',
        altKey: 'propriety.gallery.section5.img3.alt',
      },
      {
        src: '/bagno2/bagno4a.jpg',
        altKey: 'propriety.gallery.section5.img4.alt',
      },
      {
        src:'/bagno2/bagno4.jpg',
        altKey: 'propriety.gallery.section5.img5.alt',
      },
      {
        src: '/bagno2/bagno5.jpg',
        altKey: 'propriety.gallery.section5.img6.alt',
      },
      {
        src: '/bagno2/bagno6.jpg',
        altKey: 'propriety.gallery.section5.img7.alt',
      },
      {
        src: '/bagno2/bagno7.jpg',
        altKey: 'propriety.gallery.section5.img8.alt',
      },
      {
        src: '/bagno2/bagno7.jpg',
        altKey: 'propriety.gallery.section5.img9.alt',
      },
      {
        src: '/bagno2/bagno8.jpg',
        altKey: 'propriety.gallery.section5.img10.alt',
      },
      {
        src: '/bagno2/bagno9.jpg',
        altKey: 'propriety.gallery.section5.img11.alt',
      }
    ]
  },

  {titleKey: 'propriety.gallery.section6.title',
    mainImage: {
      src: '/esterni/ingressoindex.jpg',
      altKey: 'propriety.gallery.section6.mainImage.alt',
    },
    images: [
      {
        src: '/esterni/esterno1.jpg',
        altKey: 'propriety.gallery.section6.img1.alt',
      },
      {
        src: '/esterni/esterno2.jpg',
        altKey: 'propriety.gallery.section6.img2.alt',
      },
      {
        src: '/esterni/esterno3.jpg',
        altKey: 'propriety.gallery.section6.img3.alt',
      },
      {
        src: '/esterni/esterno4.jpg',
        altKey: 'propriety.gallery.section6.img4.alt',
      },
      {
        src: '/esterni/esterno5.jpg',
        altKey: 'propriety.gallery.section6.img5.alt',
      },

    {
      src: '/esterni/esterno6.jpg',
      altKey: 'propriety.gallery.section6.img6.alt',
    },
    {
      src: '/esterni/esterno7.jpg',
      altKey: 'propriety.gallery.section6.img7.alt',
    },
    {
      src: '/esterni/esterno8.jpg',
      altKey: 'propriety.gallery.section6.img8.alt',
    },
    {
      src: '/esterni/esterno9.jpg',
      altKey: 'propriety.gallery.section6.img9.alt',
    },
    {
      src: '/esterni/esterno10.jpg',
      altKey: 'propriety.gallery.section6.img10.alt',
    }
    ]
  }

]