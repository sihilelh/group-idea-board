# Task 01

Goal: Update the header to have a sidebar as well
Context: Currently this application only have a header only. You have to create a sidebar as well while keeping the header as it is. Sidebar should have these navigation items: "IdeaKart", "GPA Caluclator", "

# GPA Calculator Prompt

Goal: Creating a GPA calculator.
Context: Calculator should allow the user to input course credits and grades. When calculate button is clicked, system should compute and display overall GPA.
Constraints: All inputs should be in two text boxes. Course credits should be an integer greater than 0. Grades input should be either one of A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E. Both inputs should be required.


Goal: Editing the logic prompt
User should be allowed to input Course credit and grade for multiple courses, and then calculate the overall GPA considering all courses. 
Once the user enters the credit and grade for each course, both should be displayed in one line after the input fields and before the calculate button. each pair should be displayed in one line, such that the newly added pairs follow onto the next lines.
When both inputs given by the user don't meet the requirements, make sure to display both errors.
Grade should only be capital A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E.

Goal: Aesthetic Polishing & Interaction
Context: 
The grade should be case insensitive. 
In addition to the "Add course to List" butter, allow the user to add the course to List when he simply presses the enter butter. Remove the emoji next to the "GPA Calculator".
Organize the course credit and grade details in a table format with columns "Course Number", "Credits", "Grade". 
These 3 table headings should be centre-aligned and in bold. 
Changed font to poppins.
Instead of "+Add Course to List" button, add a small green fit-to-content button "+" in the same row as input textboxes in the right side.
Instead of "Calculate Overall GPA" button, add a small blue fit-to-content button "Calculate" in the right side.
Change the font colour of the overall gpa and its output to green. 
Create a delete function so that you can delete each row if necessary. The delete icon should only display when the user hovers to the specific row. 


