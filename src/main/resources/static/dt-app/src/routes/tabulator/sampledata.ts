export interface TabulatorSampleData {
	id: number;
	name: string;
	progress: number;
	gender: string;
	rating: number;
	col: string;
	dob: string;
	car?: number | boolean | string;
}

export const sampleData: TabulatorSampleData[] = [
	{
		id: 1,
		name: 'Oli Bob',
		progress: 12,
		gender: 'male',
		rating: 1,
		col: 'red',
		dob: '19/02/1984',
		car: 1
	},
	{
		id: 2,
		name: 'Mary May',
		progress: 1,
		gender: 'female',
		rating: 2,
		col: 'blue',
		dob: '14/05/1982',
		car: true
	},
	{
		id: 3,
		name: 'Christine Lobowski',
		progress: 42,
		gender: 'female',
		rating: 0,
		col: 'green',
		dob: '22/05/1982',
		car: 'true'
	},
	{
		id: 4,
		name: 'Brendon Philips',
		progress: 100,
		gender: 'male',
		rating: 1,
		col: 'orange',
		dob: '01/08/1980'
	},
	{
		id: 5,
		name: 'Margret Marmajuke',
		progress: 16,
		gender: 'female',
		rating: 5,
		col: 'yellow',
		dob: '31/01/1999'
	},
	{
		id: 6,
		name: 'Frank Harbours',
		progress: 38,
		gender: 'male',
		rating: 4,
		col: 'red',
		dob: '12/05/1966',
		car: 1
	},
	{
		id: 7,
		name: 'Sarah Johnson',
		progress: 67,
		gender: 'female',
		rating: 3,
		col: 'purple',
		dob: '15/03/1990',
		car: true
	},
	{
		id: 8,
		name: 'Michael Chen',
		progress: 89,
		gender: 'male',
		rating: 5,
		col: 'blue',
		dob: '28/11/1985',
		car: 1
	},
	{
		id: 9,
		name: 'Emma Wilson',
		progress: 23,
		gender: 'female',
		rating: 2,
		col: 'pink',
		dob: '07/09/1992',
		car: false
	},
	{
		id: 10,
		name: 'James Anderson',
		progress: 55,
		gender: 'male',
		rating: 4,
		col: 'green',
		dob: '03/06/1988',
		car: 1
	},
	{
		id: 11,
		name: 'Sophia Martinez',
		progress: 78,
		gender: 'female',
		rating: 5,
		col: 'orange',
		dob: '21/12/1991',
		car: true
	},
	{
		id: 12,
		name: 'William Taylor',
		progress: 34,
		gender: 'male',
		rating: 3,
		col: 'red',
		dob: '10/04/1987',
		car: 1
	},
	{
		id: 13,
		name: 'Olivia Brown',
		progress: 91,
		gender: 'female',
		rating: 5,
		col: 'yellow',
		dob: '18/07/1993',
		car: true
	},
	{
		id: 14,
		name: 'Alexander Lee',
		progress: 45,
		gender: 'male',
		rating: 3,
		col: 'blue',
		dob: '25/01/1986',
		car: false
	},
	{
		id: 15,
		name: 'Isabella Garcia',
		progress: 62,
		gender: 'female',
		rating: 4,
		col: 'purple',
		dob: '09/10/1994',
		car: 1
	},
	{
		id: 16,
		name: 'Daniel Kim',
		progress: 15,
		gender: 'male',
		rating: 2,
		col: 'green',
		dob: '30/05/1989',
		car: true
	},
	{
		id: 17,
		name: 'Mia Rodriguez',
		progress: 73,
		gender: 'female',
		rating: 4,
		col: 'pink',
		dob: '12/08/1995',
		car: 1
	},
	{
		id: 18,
		name: 'Matthew White',
		progress: 88,
		gender: 'male',
		rating: 5,
		col: 'orange',
		dob: '06/02/1984',
		car: true
	},
	{
		id: 19,
		name: 'Charlotte Harris',
		progress: 29,
		gender: 'female',
		rating: 2,
		col: 'red',
		dob: '23/11/1990',
		car: false
	},
	{
		id: 20,
		name: 'David Thompson',
		progress: 96,
		gender: 'male',
		rating: 5,
		col: 'blue',
		dob: '17/03/1983',
		car: 1
	},
	{
		id: 21,
		name: 'Amelia Clark',
		progress: 41,
		gender: 'female',
		rating: 3,
		col: 'yellow',
		dob: '04/09/1992',
		car: true
	},
	{
		id: 22,
		name: 'Joseph Lewis',
		progress: 58,
		gender: 'male',
		rating: 4,
		col: 'purple',
		dob: '27/06/1987',
		car: 1
	},
	{
		id: 23,
		name: 'Harper Walker',
		progress: 82,
		gender: 'female',
		rating: 5,
		col: 'green',
		dob: '14/12/1991',
		car: true
	},
	{
		id: 24,
		name: 'Christopher Hall',
		progress: 19,
		gender: 'male',
		rating: 1,
		col: 'pink',
		dob: '08/04/1988',
		car: false
	},
	{
		id: 25,
		name: 'Evelyn Allen',
		progress: 65,
		gender: 'female',
		rating: 4,
		col: 'orange',
		dob: '31/07/1993',
		car: 1
	},
	{
		id: 26,
		name: 'Andrew Young',
		progress: 37,
		gender: 'male',
		rating: 3,
		col: 'red',
		dob: '20/01/1986',
		car: true
	},
	{
		id: 27,
		name: 'Abigail King',
		progress: 94,
		gender: 'female',
		rating: 5,
		col: 'blue',
		dob: '11/10/1994',
		car: 1
	},
	{
		id: 28,
		name: 'Joshua Wright',
		progress: 26,
		gender: 'male',
		rating: 2,
		col: 'yellow',
		dob: '02/05/1989',
		car: false
	},
	{
		id: 29,
		name: 'Emily Scott',
		progress: 71,
		gender: 'female',
		rating: 4,
		col: 'purple',
		dob: '24/08/1995',
		car: true
	},
	{
		id: 30,
		name: 'Ryan Green',
		progress: 49,
		gender: 'male',
		rating: 3,
		col: 'green',
		dob: '16/02/1984',
		car: 1
	},
	{
		id: 31,
		name: 'Madison Adams',
		progress: 85,
		gender: 'female',
		rating: 5,
		col: 'pink',
		dob: '05/11/1990',
		car: true
	},
	{
		id: 32,
		name: 'Nathan Baker',
		progress: 33,
		gender: 'male',
		rating: 2,
		col: 'orange',
		dob: '29/03/1983',
		car: false
	},
	{
		id: 33,
		name: 'Avery Nelson',
		progress: 76,
		gender: 'female',
		rating: 4,
		col: 'red',
		dob: '13/09/1992',
		car: 1
	},
	{
		id: 34,
		name: 'Ethan Carter',
		progress: 52,
		gender: 'male',
		rating: 3,
		col: 'blue',
		dob: '07/06/1987',
		car: true
	},
	{
		id: 35,
		name: 'Sofia Mitchell',
		progress: 98,
		gender: 'female',
		rating: 5,
		col: 'yellow',
		dob: '22/12/1991',
		car: 1
	},
	{
		id: 36,
		name: 'Benjamin Perez',
		progress: 44,
		gender: 'male',
		rating: 3,
		col: 'purple',
		dob: '18/04/1988',
		car: true
	}
];
