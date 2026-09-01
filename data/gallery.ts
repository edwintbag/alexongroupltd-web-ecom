import type { GalleryMedia } from '@/types';

/**
 * Every image below is a real photograph taken from the supplied Alexon
 * catalogue and banner. Captions describe what is visible — no locations,
 * clients or project names are asserted, because the documents state none.
 */
export const gallery: GalleryMedia[] = [
  { id: 'g-01', src: '/images/site/hero-backhoe.jpg', alt: 'Alexon-liveried JCB backhoe loader on a murram site', caption: 'Backhoe loader on site', category: 'machinery', aspect: 'landscape' },
  { id: 'g-02', src: '/images/site/production-line.jpg', alt: 'Block-making machine pressing concrete blocks at the Alexon yard', caption: 'The block line, mid-press', category: 'production', aspect: 'landscape' },
  { id: 'g-03', src: '/images/site/site-masonry.jpg', alt: 'Masons laying blockwork columns on an Alexon construction site', caption: 'Blockwork going up', category: 'construction', aspect: 'portrait' },
  { id: 'g-04', src: '/images/site/alexon-yard.jpg', alt: 'The Alexon yard with stacked precast products and signage', caption: 'The yard at Ugunja', category: 'production', aspect: 'landscape' },
  { id: 'g-05', src: '/images/site/tipper-fleet.jpg', alt: 'Alexon tipper truck ready for dispatch', caption: 'Tipper ready to load', category: 'logistics', aspect: 'landscape' },
  { id: 'g-06', src: '/images/site/water-bowser.jpg', alt: 'Alexon clean water bowser delivering to premises', caption: 'Clean water delivery', category: 'water-supply', aspect: 'landscape' },
  { id: 'g-07', src: '/images/products/concrete-blocks.jpg', alt: 'Stacked pressed concrete walling blocks', caption: 'Blocks curing before dispatch', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-08', src: '/images/products/cabros-coloured.jpg', alt: 'Coloured zigzag cabro paving laid in a pattern', caption: 'Coloured cabros, zigzag profile', category: 'cabros', aspect: 'square' },
  { id: 'g-09', src: '/images/products/cabros-grey.jpg', alt: 'Grey concrete block standing on the yard floor', caption: 'Plain grey, straight from the press', category: 'concrete-products', aspect: 'portrait' },
  { id: 'g-10', src: '/images/products/fencing-poles.jpg', alt: 'Stacked precast concrete fencing poles', caption: 'Fencing poles, stacked by height', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-11', src: '/images/products/culverts.jpg', alt: 'Precast concrete culvert rings in the yard', caption: 'Culvert rings in the yard', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-12', src: '/images/products/road-kerb-channel.jpg', alt: 'Road kerbs and channels stacked for collection', caption: 'Kerbs and channels', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-13', src: '/images/products/wall-coping.jpg', alt: 'Precast wall coping stacked on edge', caption: 'Coping, stacked on edge', category: 'concrete-products', aspect: 'portrait' },
  { id: 'g-14', src: '/images/products/slabs.jpg', alt: 'Precast concrete slabs stacked in the yard', caption: 'Slabs, two sizes', category: 'concrete-products', aspect: 'square' },
  { id: 'g-15', src: '/images/products/spindles.jpg', alt: 'Cast concrete balustrade spindles under a shade', caption: 'Spindles under the shade', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-16', src: '/images/products/column-tops.jpg', alt: 'Precast column tops stacked in the yard', caption: 'Column tops', category: 'concrete-products', aspect: 'portrait' },
  { id: 'g-17', src: '/images/products/shallow-drain.jpg', alt: 'Precast shallow drain sections', caption: 'Shallow drain sections', category: 'concrete-products', aspect: 'landscape' },
  { id: 'g-18', src: '/images/products/sand-aggregates.jpg', alt: 'Heap of quarry chips at the Alexon yard', caption: 'Aggregates, ready to load', category: 'production', aspect: 'landscape' },
  { id: 'g-19', src: '/images/equipment/excavator.jpg', alt: 'Tracked excavator loading a tipper on site', caption: 'Excavator loading out', category: 'machinery', aspect: 'landscape' },
  { id: 'g-20', src: '/images/equipment/grader.jpg', alt: 'Motor grader shaping a murram road', caption: 'Grader shaping the formation', category: 'machinery', aspect: 'landscape' },
  { id: 'g-21', src: '/images/equipment/lowbed-trailer.jpg', alt: 'Alexon lowbed prime mover on the highway', caption: 'Lowbed on the move', category: 'logistics', aspect: 'landscape' },
  { id: 'g-22', src: '/images/equipment/tippers.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
  { id: 'g-23', src: '/images/equipment/tippers 2.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
  { id: 'g-24', src: '/images/equipment/tipper-trailer.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
  { id: 'g-25', src: '/images/equipment/pickup.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
  { id: 'g-26', src: '/images/equipment/fleet.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
  { id: 'g-27', src: '/images/equipment/frr90.jpg', alt: 'Alexon fleet', caption: 'The fleet, lined up', category: 'logistics', aspect: 'landscape' },
];

export const galleryFilters = [
  { id: 'all', label: 'All' },
  { id: 'construction', label: 'Construction' },
  { id: 'concrete-products', label: 'Concrete Products' },
  { id: 'cabros', label: 'Cabros' },
  { id: 'machinery', label: 'Machinery' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'water-supply', label: 'Water Supply' },
  { id: 'production', label: 'The Yard' },
] as const;
