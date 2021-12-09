# Fetch Rewards Coding Exercise - Backend

## Challenge
Write a web service that accepts HTTP requests and returns responses based on the conditions outlined in the next section.
### Background
Our users have points in their accounts. Users only see a single balance in their accounts. But for reporting purposes we actually track their  
points per payer/partner. In our system, each transaction record contains: ​`payer​ (string)`, `​points​ (integer)`, ​`timestamp​ (date)`.  

For earning points it is easy to assign a payer, we know which actions earned the points. And thus which partner should be paying for the points.  

When a user spends points, they don't know or care which payer the points come from. But, our accounting team does care how the points are  
spent. There are two rules for determining what points to "spend" first:  
●  We want the oldest points to be spent first (oldest based on transaction timestamp, not the order they’re received)  
●  We want no payer's points to go negative.
The coding exercise includes

### Required Routes
●  Add transactions for a specific payer and date.  
●  Spend points using the rules above and return a list of `​{ "payer": <string>, "points": <integer> }​` for each call.  
●  Return all payer point balances.

## Solution
I created a RESTful API in JavaScript with a MongoDB database.

### Tools Utilized
- JavaScript
- Node
- Express
- MongoDB
- dotenv
- mongoose
- cors
- morgan

### Prerequisites

-   MongoDB - see [website](https://docs.mongodb.com/manual/installation/) for installation instructions

### Getting Started
Clone this repository to your local machine.
`TBD`

Install dependencies
`npm i`

Create .env file with the following environment variables in the root of the project directory
```
MONGODB_URI=(Enter your MongoDB URI here)
PORT=(Enter port you wish to utilize here)
```

Start node server
`npm start`

## API interaction:

### Reward Routes

-  `POST /create` --> returns copy of created entry in JSON

```
[REQUEST]
{
	payer: <string>     *required: TRUE*
	points: <integer>   *required: TRUE*
	timestamp: <date>   *required: TRUE*
}

[RESPONSE]
{
	payer: <string>, 
	points: <integer>,
	timestamp: <date>
}
```
-  `GET /balance` --> returns JSON of payers and points

```
[RESPONSE]
{
	payer: points <integer>
}

```
-  `POST /spend` --> returns JSON list of payers and points subtracted

```
[REQUEST]
{
	points: <integer>
}

[RESPONSE]
[
	{
		payer: <string>, 
		points: <integer>,
	}
]
```

### Future Stretch Goals

- Create test cases for all routes and models
- Handle edge cases
	- Prevent negative point values on `/spend` route
	- What should happen if `/create` route is sent an entry with a negative point value for a payer that does not yet exist
- Add authentication requirements to protect routes
