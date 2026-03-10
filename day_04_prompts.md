# Task 01

Goal: Update the header to have a sidebar as well so that this single app can use used as a tool box
Context: Currently this application only have a header only. You have to create a sidebar as well while keeping the header as it is. Sidebar should have these navigation items: (cart icon) "IdeaKart", (badge icon) "GPA Caluclator", (timer icon) "Pomodoro Timer", (calender icon) "My Schedule". Then replace the main app name to "ScholarKit" since this is a multiple tools in one website. 

Constraints:
- All icons needs to be in SVG format. 
- Sidebar should be mobile responsive, dark light mode theme as well 
-

# My Schedule Prompt

Goal: Create a exam,event,lecture scheduling calander for student 
Context: You should create a calander that users (students) can add/remove/edit/star events such as exams, events, lectures, holidays etc. The main element should be an calander and you should use popups for add/remove/edit events.

Constraints: 
- The calender should be filled most of the page. 
- Calender design should be aligned with current designs
- An event can be only added if it is in future. 
- Todays events should display in a seperate card for easy visibility


# Color change and visual animations

Goal: Animate element showup after the load and change the color pallet
Context: You should use framer motion to animate elements and make the website feels smooth. The color pallet should be in Gold and maroon. You should think about how colors should be matched and how those colors should be in both light and dark modes. For the header app icon, use a 150x150 placeholder image. 

# GPA Calculator Prompt

Logic 

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
Goal: Update the header to have a sidebar as well
Context: Currently this application only have a header only. You have to create a sidebar as well while keeping the header as it is. Sidebar should have these navigation items: "IdeaKart", "GPA Caluclator", "




# Task - Pomodoro Timer

Context: Our initial idea is building a complete "Student Toolkit" Website.


Requirements are as follows:
1. The application must be implemented using HTML, CSS, and JavaScript.
2. The page must include the following sections:  
○ A Navigation Bar containing the following menu items:  
        ■ GPA Calculator  
        ■ Study Timer  
○ A Sidebar displaying a section titled “Upcoming Events.”  
3. Use CSS classes to organize the layout. The design should clearly include:  
    ○ navbar  
    ○ sidebar


Goal: Currently the GPA calculator is being developed by some part of our team and our task is to build the Pomodoro Study Timer. 

Requirements for that timer are as follows:
○ A 25-minute countdown timer
○ A Start button
○ A Reset button
○ When the timer reaches zero, a bell sound or notification should appear.
○ A designated window for analytics with activity summary, total focus time according to the pausing and resetting timer data.

Constraints: Only use HTML, CSS and JavaScript. You can enhance the visual appearance and interaction of the dashboard by adding smooth fade-in animations so that sections appear gradually when the page loads.

Remember that the overall color theme should match UCSC(University of Colombo School of Computing) branding colors:  
    ■ Maroon  
    ■ Gold  

The website should also be mobile responsive.

Can you generate the relevant code files required to build the timer?
