link to github
live page onvercel
schema, wireframe, etc

User Stories
🐿️ As a user, I want to browse a list of posts, sortable by ascending or descending order
🐿️ As a user, I want to be able to leave a comment sharing my thoughts on each post
Stretch goal:
🐿️ As a user, I want to see a list of categories, and click on a category to see a list of posts in that category
Requirements
IMPORTANT: You don't have to make a generic blog with posts. It can be ANYTHING! So long as you are able to comment on it, it could be recipes, reviews, products, job listings, podcast episodes, movies etc etc etc

🎯 Created using create-next-app

🎯 Design a SQL schema for a posts table, and a comments table that has a post_id column connecting it to the posts table.

🎯 Either create a form where users can add posts OR seed your database with at least 4 posts that comments can be added to (if you do the seed, one of the stretch goals will be harder).

🎯 Add a form to the individual post page to allow creating a new comment, which is saved to the new comments table including the Post ID.

🎯 Refresh the /posts route data when adding a new post, and redirect the user to the list of posts

🎯 Refresh the /post/:postId route when adding a new comment, so the new comment is displayed on the page

🎯 Add static and dynamic metadata to your pages

Stretch Goals
🏹 Add a categories table to allow categorisation of posts at creation time using a dropdown menu. Add a /categories route that lists all categories, and a /categories/:id route that lists all posts in a category.

🏹 Add a new /posts/:id/edit route that allows editing a post. Populate the form with the post data, and save changes by updating the post in the database with a server action.

🏹 Add a delete button to the post page that removes the post from the database.

🏹 Add a new /posts/:id/comments/:id/edit route that allows editing a comment. Populate the form with the comment data, and save changes by updating the comment in the database with a server action.

Please also provide an assignment reflection in your project README.md file.
(Required)
🎯 Please mention the requirements you met and which goals you achieved for this assignment.

made a list of posts, filterable by categories, and leave posts and comments, show likes, and delete them. used next js, used sql to make post tables, and connect the data through ids, refreshed content when fresh data submitted, added static and dynamci meta data.

🎯 Were there any requirements or goals that you were not quite able to achieve?

didn't make the posts orderable, fill out the content or allow editing. Also couldn't make forms clear once submitted.

🎯 If so, could you please tell us what was it that you found difficult about these tasks?

I forgot to do some, helping other with edits couldn't see away to inclde the old post text in a way that was easiby editable, I implemented other features, and was let down by tailwind suddenly.

(Optional)
🏹 Feel free to add any other reflections you would like to share about your submission e.g.

What went really well and what could have gone better?
I couldn't implement grid, tailwind was a bit hit and miss.
I considered and implemented elements for the usecase I am proud of.

Using sql in next is pretty simple, though it is not always easy to know how it needs to be wrangled.

Detailing useful external sources that helped you complete the assignment (e.g Youtube tutorials).
see attributes, also Theo Reeves
Describing errors or bugs you encountered while completing your assignment.

Tailwind abandoned me when styling delete button. it all went well but stopped implementing or responding after I did a git push. I can copy code in from other files and it will work but changes in that files no longer function. Not a fan.

Requesting feedback about a specific part of your submission.

That tailwind thing. Also, making forms clear once submitted. has something to do with use client, but couldn't figure it out.
