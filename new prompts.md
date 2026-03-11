ERROR 01:
<br>
goal: Fixing the error with accepting ideas without any alphabetic or numeric characters<br>
context: When user inputs only other characters such as the space and special  characters, this application takes them as an idea. So fix that by only accepting ideas begin with an alphebetic letter or a numeric character


ERROR 02:
<br>
Modify this function to prevent duplicate ideas. Before adding a new idea to localStorage and the UI, check if the input value (case-insensitive) already exists in the ideas array. If it exists, do not add it; instead, show an alert saying 'This idea already exists!'. Clear the input field only if the addition is successful.