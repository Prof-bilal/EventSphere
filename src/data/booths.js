export const booths = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  expoId: 1,
  number: `B${String(index + 1).padStart(2, '0')}`,
  floor: 'Hall A',
  size: index % 3 === 0 ? 'Large' : 'Standard',
  category: index % 2 === 0 ? 'Technology' : 'Design',
  status: [2, 6, 9].includes(index) ? 'occupied' : index === 4 ? 'reserved' : 'available',
  exhibitor: index === 2 ? 'Northstar Labs' : index === 6 ? 'Mosaic Works' : index === 9 ? 'Bright Loop' : '',
}))
