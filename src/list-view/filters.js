// const dayjs = require('dayjs');
// const isoWeek = require('dayjs/plugin/isoWeek');
// const calendar = require('dayjs/plugin/calendar');

// dayjs.extend(isoWeek);
// dayjs.extend(calendar);

// const FILTERS = {
//     today: dayjs().startOf('day').calendar(null, {
//         sameDay: '[Today]', // Today
//         nextDay: '[Tomorrow]', // Tomorrow
//         nextWeek: 'dddd', // Next week
//         lastDay: '[Yesterday]', // Yesterday
//         lastWeek: '[Last] dddd', // Last week
//         sameElse: 'DD/MM/YYYY' // Everything else
//     }),
//     tomorrow: dayjs().add(1, 'day').startOf('day').calendar(null, {
//         sameDay: '[Today]', // Today
//         nextDay: '[Tomorrow]', // Tomorrow
//         nextWeek: 'dddd', // Next week
//         lastDay: '[Yesterday]', // Yesterday
//         lastWeek: '[Last] dddd', // Last week
//         sameElse: 'DD/MM/YYYY' // Everything else
//     }),
//     'on-this-week': dayjs().endOf('isoWeek').add(1, 'day').calendar(null, {
//         sameDay: '[Today]', // Today
//         nextDay: '[Tomorrow]', // Tomorrow
//         nextWeek: 'dddd', // Next week
//         lastDay: '[Yesterday]', // Yesterday
//         lastWeek: '[Last] dddd', // Last week
//         sameElse: 'DD/MM/YYYY' // Everything else
//     }),
//     'on-next-week': dayjs().add(1, 'week').startOf('day').add(1, 'day').calendar(null, {
//         sameDay: '[Today]', // Today
//         nextDay: '[Tomorrow]', // Tomorrow
//         nextWeek: 'dddd', // Next week
//         lastDay: '[Yesterday]', // Yesterday
//         lastWeek: '[Last] dddd', // Last week
//         sameElse: 'DD/MM/YYYY' // Everything else
//     }),
//     later: dayjs().add(2, 'week').startOf('day').calendar(null, {
//         sameDay: '[Today]', // Today
//         nextDay: '[Tomorrow]', // Tomorrow
//         nextWeek: 'dddd', // Next week
//         lastDay: '[Yesterday]', // Yesterday
//         lastWeek: '[Last] dddd', // Last week
//         sameElse: 'DD/MM/YYYY' // Everything else
//     })
// };

// module.exports = FILTERS;


const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)
// dayjs.extend(isSameOrBefore)

dayjs.extend(isoWeek)
console.log("dayjs().isoWeek()",dayjs().isoWeek());

dayjs().calendar(dayjs('2023-01-01'))
dayjs().calendar(null, {
  sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
  nextDay: '[Tomorrow at] h:mm A', // The next day ( Tomorrow at 2:30 AM )
  nextWeek: 'dddd [at] h:mm A', // The next week ( Sunday at 2:30 AM )
  lastDay: '[Yesterday at] h:mm A', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd [at] h:mm A', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'DD/MM/YYYY' // Everything else ( 17/10/2011 )
})

const FILTERS = {
    today: dayjs().startOf('day'),
    tomorrow: dayjs().add(1, 'day').startOf('day'),
    'on-this-week': dayjs().endOf('isoWeek'),
    'on-next-week': dayjs().add(1, 'week').startOf('day').endOf('isoWeek'),
    later: dayjs().add(2, 'week').startOf('day')

}
export default FILTERS;




// filters.js
// import dayjs from 'dayjs';
// import isoWeek from 'dayjs/plugin/isoWeek';
// dayjs.extend(isoWeek);

// const now = dayjs();

// export const FILTERS = {
//   now,
//   startOfToday: now.startOf('day'),
//   endOfToday: now.endOf('day'),
//   startOfTomorrow: now.add(1, 'day').startOf('day'),
//   endOfThisWeek: now.endOf('isoWeek'),            // end of current iso-week
//   startOfNextWeek: now.add(1, 'week').startOf('isoWeek'),
//   endOfNextWeek: now.add(1, 'week').endOf('isoWeek'),
//   startOfLater: now.add(1, 'week').endOf('isoWeek').add(1, 'day').startOf('day')
// };
