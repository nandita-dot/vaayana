import json
import sqlite3
import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'backend', 'data', 'vaayana.db')
MATH_TS_PATH = os.path.join(BASE_DIR, 'frontend', 'src', 'data', 'mathLessons.ts')
SAMPLE_DATA_PATH = os.path.join(BASE_DIR, 'backend', 'app', 'sample_data.py')

CHAPTER_5 = {
    "id": "scert-std4-maths-ch5-its-time",
    "titleEn": "It's Time! Clocks, Elapsed Time & Calendar",
    "titleMl": "സമയം എത്രയായി?: ക്ലോക്കുകളും കലണ്ടർ ഗണിതവും",
    "subject": "Mathematics",
    "grade": "Class 4",
    "chapter": "അധ്യായം 5: സമയം എത്രയായി?",
    "descriptionEn": "Master hours, minutes, seconds, synchronized analog and digital clocks, race-walk elapsed time calculations, water drop timers, and monthly calendar mathematics.",
    "descriptionMl": "മണിക്കൂർ, മിനിറ്റ്, സെക്കൻഡ്, ഡിജിറ്റൽ-അനലോഗ് ക്ലോക്കുകൾ, നടത്തമത്സര സമയം, തുള്ളി ചോർച്ച സിമുലേഷൻ, കലണ്ടർ ഗണിതം എന്നിവ പഠിക്കാം.",
    "durationMinutes": 35,
    "tags": ["SCERT Kerala", "Mathematics", "Class 4", "Time", "Clocks", "Calendar", "Elapsed Time", "Smartboard Ready"],
    "createdAt": "2026-11-12T10:00:00Z",
    "version": 1,
    "approvalStatus": "approved",
    "learningObjectivesEn": [
        "Understand time units: 1 hour = 60 minutes, 1 minute = 60 seconds.",
        "Read and synchronize digital and analog clocks with hour, minute, and second hands.",
        "Calculate elapsed time by finding the difference between start and finish times.",
        "Solve practical calendar problems: weekdays, total days in month, and leap years."
    ],
    "learningObjectivesMl": [
        "1 മണിക്കൂർ = 60 മിനിറ്റ്, 1 മിനിറ്റ് = 60 സെക്കൻഡ് എന്നീ സമയ മാനങ്ങൾ മനസ്സിലാക്കുക.",
        "ഡിജിറ്റൽ, അനലോഗ് ക്ലോക്കുകൾ കൃത്യമായി വായിക്കാനും സമയം തിരിക്കാനും പഠിക്കുക.",
        "തുടങ്ങിയ സമയവും അവസാനിച്ച സമയവും തമ്മിലുള്ള വ്യത്യാസം കണ്ടെത്തി ഓടിയ സമയം കണക്കാക്കുക.",
        "കലണ്ടറിലെ ദിവസങ്ങൾ, ആഴ്ചകൾ, അധിവർഷം എന്നിവ അടിസ്ഥാനമാക്കിയുള്ള ചോദ്യങ്ങൾ പരിഹരിക്കുക."
    ],
    "concepts": [
        {
            "id": "c5-1",
            "titleEn": "Hours, Minutes, and Seconds",
            "titleMl": "മണിക്കൂറുകളും മിനിറ്റുകളും സെക്കൻഡുകളും",
            "explanationEn": "A day has 24 hours. 1 hour contains 60 minutes, and 1 minute contains 60 seconds. The thin red hand measures seconds ticking by.",
            "explanationMl": "ഒരു ദിവസത്തിൽ 24 മണിക്കൂറുകളുണ്ട്. 1 മണിക്കൂറിൽ 60 മിനിറ്റും, 1 മിനിറ്റിൽ 60 സെക്കൻഡുകളുമുണ്ട്. ചുവന്ന നേർത്ത സൂചിയാണ് സെക്കൻഡുകൾ അളക്കുന്നത്.",
            "realLifeExampleEn": "Class period is 45 minutes; heart beats approximately once every second.",
            "realLifeExampleMl": "ക്ലാസ്സിലെ ഒരു പിരീഡ് 45 മിനിറ്റാണ്; ഹൃദയമിടിപ്പ് ഏകദേശം ഓരോ സെക്കൻഡിലും സംഭവിക്കുന്നു.",
            "suggestedVisual": "Synchronized dual clocks showing second, minute and hour hands moving together.",
            "sourcePage": "45",
            "evidenceSnippet": "60 seconds make 1 minute, 60 minutes make 1 hour."
        },
        {
            "id": "c5-2",
            "titleEn": "The Girls' Race: Calculating Elapsed Time",
            "titleMl": "പെൺകുട്ടികളുടെ നടത്ത മത്സരം: ഓടിയ സമയം കണ്ടെത്തൽ",
            "explanationEn": "Elapsed time is the difference between start time and finish time. When the race starts at 9:00:00 AM and finishes at 9:02:15 AM, the elapsed time is 2 minutes 15 seconds.",
            "explanationMl": "ഒരു പ്രവർത്തനം ആരംഭിച്ച സമയവും അവസാനിച്ച സമയവും തമ്മിലുള്ള വ്യത്യാസമാണ് എടുത്ത സമയം (Elapsed Time).",
            "realLifeExampleEn": "Measuring how long school assembly or 100m sports walk takes.",
            "realLifeExampleMl": "സ്കൂൾ അസംബ്ലി അല്ലെങ്കിൽ നടത്ത മത്സരം എത്ര സമയം നീണ്ടുനിന്നു എന്ന് അളക്കുന്നത് പോലെ.",
            "suggestedVisual": "Cartoon race track with three girls and finish time clocks.",
            "sourcePage": "47",
            "evidenceSnippet": "Find the time taken by each runner to reach the finish line."
        },
        {
            "id": "c5-3",
            "titleEn": "Little Drops, Mighty Ocean: 1 Second = 1 mL",
            "titleMl": "തുള്ളികൾ ചേർന്ന് മഹാസമുദ്രം: 1 സെക്കൻഡ് = 1 mL",
            "explanationEn": "When a tap leaks 1 mL per second, in 10 minutes (600 seconds) it wastes 600 mL of water! Time conversion directly helps us understand conservation.",
            "explanationMl": "ഒരു സെക്കൻഡിൽ 1 mL വെള്ളം ഇറ്റുവീഴുന്ന ടാപ്പിൽ നിന്ന് 10 മിനിറ്റിൽ (600 സെക്കൻഡ്) 600 mL വെള്ളം പാഴാകുന്നു!",
            "realLifeExampleEn": "Preventing tap leakage in school drinking water stations.",
            "realLifeExampleMl": "സ്കൂളിലെ കുടിവെള്ള ടാപ്പുകൾ ലീക്കാവാതെ സൂക്ഷിക്കുന്നത്.",
            "suggestedVisual": "Animated leaking tap and graduated measuring jar filling up.",
            "sourcePage": "49",
            "evidenceSnippet": "How many millilitres leak in 10 minutes?"
        },
        {
            "id": "c5-4",
            "titleEn": "Calendar Mathematics and Leap Years",
            "titleMl": "കലണ്ടർ ഗണിതവും അധിവർഷവും",
            "explanationEn": "A regular year has 365 days, while a leap year has 366 days (February 29). The same weekday repeats every 7 days.",
            "explanationMl": "സാധാരണ വർഷത്തിൽ 365 ദിവസങ്ങളും അധിവർഷത്തിൽ 366 ദിവസങ്ങളുമുണ്ട് (ഫെബ്രുവരി 29). ഓരോ 7 ദിവസത്തിലും ഒരേ ആഴ്ച ദിവസം ആവർത്തിക്കുന്നു.",
            "realLifeExampleEn": "Finding the day of your birthday or school holidays on the calendar.",
            "realLifeExampleMl": "കലണ്ടർ നോക്കി ജന്മദിനമോ സ്കൂൾ അവധി ദിനമോ ഏത് ദിവസമാണെന്ന് കണ്ടെത്തുന്നത്.",
            "suggestedVisual": "Large monthly interactive calendar with weekday markers.",
            "sourcePage": "52",
            "evidenceSnippet": "Count the Sundays in January and observe the 7-day pattern."
        }
    ],
    "vocabulary": [
        {
            "id": "v5-1",
            "word": "Elapsed Time / ഓടിയ സമയം",
            "meaningEn": "The amount of time that passes from the start of an event to its end.",
            "meaningMl": "ഒരു സംഭവം തുടങ്ങി അവസാനിക്കാൻ എടുത്ത ആകെ സമയം.",
            "exampleEn": "The elapsed time for Ananya's race walk was 2 minutes and 15 seconds.",
            "exampleMl": "അനന്യ നടത്ത മത്സരം പൂർത്തിയാക്കാൻ എടുത്ത സമയം 2 മിനിറ്റ് 15 സെക്കൻഡാണ്."
        },
        {
            "id": "v5-2",
            "word": "Leap Year / അധിവർഷം",
            "meaningEn": "A year containing 366 days with February having 29 days.",
            "meaningMl": "ഫെബ്രുവരിയിൽ 29 ദിവസങ്ങൾ വരുന്ന 366 ദിവസങ്ങളുള്ള വർഷം.",
            "exampleEn": "A leap year occurs once every 4 years.",
            "exampleMl": "4 വർഷത്തിലൊരിക്കൽ അധിവർഷം വരുന്നു."
        }
    ],
    "activities": [
        {
            "id": "act-girls-race",
            "titleEn": "The Girls' Race Walk",
            "titleMl": "പെൺകുട്ടികളുടെ നടത്ത മത്സരം",
            "activityType": "girls_race",
            "learningObjectiveEn": "Calculate elapsed time using synchronized analog and digital clocks.",
            "learningObjectiveMl": "അനലോഗ്, ഡിജിറ്റൽ ക്ലോക്കുകൾ ഉപയോഗിച്ച് ഓടിയ സമയം കണക്കാക്കുക.",
            "instructionEn": "Start the race, inspect each finish time, and enter the elapsed minutes and seconds.",
            "instructionMl": "മത്സരം ആരംഭിച്ച് ഓരോരുത്തരുടെയും സമയം പരിശോധിച്ച് ഉത്തരം നൽകുക.",
            "activityModule": "girls_race"
        },
        {
            "id": "act-water-leak",
            "titleEn": "Little Drops, Mighty Ocean",
            "titleMl": "തുള്ളികൾ ചേർന്ന് മഹാസമുദ്രം",
            "activityType": "water_leak",
            "learningObjectiveEn": "Convert minutes to seconds and calculate total volume of water leaked.",
            "learningObjectiveMl": "മിനിറ്റുകളെ സെക്കൻഡുകളാക്കി പാഴായ ജലത്തിന്റെ അളവ് കണ്ടെത്തുക.",
            "instructionEn": "Run the leak simulation and calculate how many mL will leak in 10 minutes.",
            "instructionMl": "സിമുലേഷൻ പ്രവർത്തിപ്പിച്ച് 10 മിനിറ്റിൽ എത്ര mL പാഴാകുമെന്ന് കണക്കുകൂട്ടുക.",
            "activityModule": "water_leak"
        },
        {
            "id": "act-calendar-math",
            "titleEn": "Calendar Mathematics",
            "titleMl": "കലണ്ടർ ഗണിതം",
            "activityType": "calendar_math",
            "learningObjectiveEn": "Identify weekdays, calculate 7-day jumps, and explore leap years.",
            "learningObjectiveMl": "ദിവസങ്ങൾ കണ്ടെത്താനും 7 ദിവസങ്ങളുടെ ക്രമം മനസ്സിലാക്കാനും കലണ്ടർ ഉപയോഗിക്കുക.",
            "instructionEn": "Touch the dates on the calendar and answer the smartboard challenges.",
            "instructionMl": "കലണ്ടറിലെ തീയതികളിൽ തൊട്ട് ചോദ്യങ്ങൾക്ക് ഉത്തരം കണ്ടെത്തുക.",
            "activityModule": "calendar_math"
        }
    ],
    "slides": [
        {
            "id": "s5-1",
            "slideType": "interactive_activity",
            "titleEn": "The Girls' Race Walk: Synchronized Clocks & Elapsed Time",
            "titleMl": "പെൺകുട്ടികളുടെ നടത്ത മത്സരം: ക്ലോക്കുകളും ഓടിയ സമയവും",
            "contentEn": "Watch three girls race walk towards the finish line! Read the synchronized analog and digital clocks to calculate each runner's elapsed time.",
            "contentMl": "മൂന്ന് പെൺകുട്ടികൾ ഫിനിഷിംഗ് ലൈനിലേക്ക് നടക്കുന്നത് കാണാം! ക്ലോക്കുകൾ നോക്കി ഓരോരുത്തരും എടുത്ത സമയം കണക്കാക്കാം.",
            "visualType": "interactive_activity",
            "interactiveModule": "girls_race",
            "keyPointsEn": ["1 hour = 60 minutes", "1 minute = 60 seconds", "Elapsed time = Finish time - Start time"],
            "keyPointsMl": ["1 മണിക്കൂർ = 60 മിനിറ്റ്", "1 മിനിറ്റ് = 60 സെക്കൻഡ്", "ഓടിയ സമയം = അവസാന സമയം - തുടങ്ങിയ സമയം"],
            "sourcePageRef": "Page 47",
            "evidenceSnippet": "Race starts at 9:00:00 AM."
        },
        {
            "id": "s5-2",
            "slideType": "interactive_activity",
            "titleEn": "Little Drops, Mighty Ocean: 1 Second = 1 mL",
            "titleMl": "തുള്ളികൾ ചേർന്ന് മഹാസമുദ്രം: 1 സെക്കൻഡ് = 1 mL",
            "contentEn": "Each second, one millilitre of water leaks out. Use the interactive digital timer to calculate how many mL of water will leak out in 10 minutes (600 mL)!",
            "contentMl": "ഓരോ സെക്കൻഡിലും ഒരു മില്ലിലിറ്റർ വെള്ളം ഇറ്റുവീഴുന്നു. 10 മിനിറ്റിൽ എത്ര മില്ലിലിറ്റർ വെള്ളം പാഴാകും എന്ന് കണ്ടെത്തൂ!",
            "visualType": "interactive_activity",
            "interactiveModule": "water_leak",
            "keyPointsEn": ["1 min = 60 sec", "10 min = 600 sec", "600 sec × 1 mL = 600 mL leaked"],
            "keyPointsMl": ["1 മിനിറ്റ് = 60 സെക്കൻഡ്", "10 മിനിറ്റ് = 600 സെക്കൻഡ്", "600 സെക്കൻഡ് × 1 mL = 600 mL പാഴായി"],
            "sourcePageRef": "Page 49",
            "evidenceSnippet": "Each second 1 mL of water leaks out."
        },
        {
            "id": "s5-3",
            "slideType": "interactive_activity",
            "titleEn": "Interactive Monthly Calendar & Weekday Mathematics",
            "titleMl": "ഇന്ററാക്ടീവ് കലണ്ടറും ആഴ്ചയിലെ ദിവസങ്ങളും",
            "contentEn": "Touch any date on the calendar! Explore weekdays in English and Malayalam, count Sundays, add 7-day jumps, and discover why leap years have 29 days in February.",
            "contentMl": "കലണ്ടറിലെ തീയതികളിൽ തൊട്ടുനോക്കൂ! ഞായറാഴ്ചകൾ എണ്ണാനും 7 ദിവസങ്ങൾ കൂട്ടാനും അധിവർഷം അറിയാനും പഠിക്കാം.",
            "visualType": "interactive_activity",
            "interactiveModule": "calendar_math",
            "keyPointsEn": ["7 days in a week", "Every 7 days the same day repeats", "Leap year adds Feb 29"],
            "keyPointsMl": ["ആഴ്ചയിൽ 7 ദിവസങ്ങൾ", "7 ദിവസങ്ങൾ കൂടുമ്പോൾ അതേ ദിവസം വരുന്നു", "അധിവർഷത്തിൽ ഫെബ്രുവരി 29 ഉണ്ടാകും"],
            "sourcePageRef": "Page 52",
            "evidenceSnippet": "What day of the week is the 15th?"
        }
    ],
    "quiz": [
        {
            "id": "q5-1",
            "type": "multiple_choice",
            "questionEn": "How many seconds are there in 5 minutes?",
            "questionMl": "5 മിനിറ്റിൽ ആകെ എത്ര സെക്കൻഡുകൾ ഉണ്ട്?",
            "optionsEn": ["300 seconds", "60 seconds", "500 seconds", "250 seconds"],
            "optionsMl": ["300 സെക്കൻഡ്", "60 സെക്കൻഡ്", "500 സെക്കൻഡ്", "250 സെക്കൻഡ്"],
            "correctIndex": 0,
            "explanationEn": "1 minute = 60 seconds, so 5 minutes = 5 × 60 = 300 seconds.",
            "explanationMl": "1 മിനിറ്റ് = 60 സെക്കൻഡ്, അതിനാൽ 5 മിനിറ്റ് = 5 × 60 = 300 സെക്കൻഡ്."
        },
        {
            "id": "q5-2",
            "type": "multiple_choice",
            "questionEn": "If a race starts at 9:00:00 AM and ends at 9:03:05 AM, what is the elapsed time?",
            "questionMl": "മത്സരം രാവിലെ 9:00:00 ന് തുടങ്ങി 9:03:05 ന് അവസാനിച്ചാൽ എടുത്ത സമയം എത്ര?",
            "optionsEn": ["3 minutes 5 seconds", "3 minutes 50 seconds", "2 minutes 5 seconds", "35 seconds"],
            "optionsMl": ["3 മിനിറ്റ് 5 സെക്കൻഡ്", "3 മിനിറ്റ് 50 സെക്കൻഡ്", "2 മിനിറ്റ് 5 സെക്കൻഡ്", "35 സെക്കൻഡ്"],
            "correctIndex": 0,
            "explanationEn": "Finish time (9:03:05) minus start time (9:00:00) = 3 minutes 5 seconds.",
            "explanationMl": "9:03:05 ൽ നിന്ന് 9:00:00 കുറച്ചാൽ 3 മിനിറ്റ് 5 സെക്കൻഡ് ലഭിക്കും."
        },
        {
            "id": "q5-3",
            "type": "multiple_choice",
            "questionEn": "A tap leaks 1 mL per second. How many mL leak in 10 minutes?",
            "questionMl": "ഒരു സെക്കൻഡിൽ 1 mL വീഴുന്ന ടാപ്പിൽ നിന്ന് 10 മിനിറ്റിൽ എത്ര mL വെള്ളം പാഴാകും?",
            "optionsEn": ["600 mL", "60 mL", "100 mL", "1000 mL"],
            "optionsMl": ["600 mL", "60 mL", "100 mL", "1000 mL"],
            "correctIndex": 0,
            "explanationEn": "10 minutes = 600 seconds. 600 seconds × 1 mL = 600 mL.",
            "explanationMl": "10 മിനിറ്റ് = 600 സെക്കൻഡ്. 600 സെക്കൻഡ് × 1 mL = 600 mL."
        }
    ]
}

CHAPTER_6 = {
    "id": "scert-std4-maths-ch6-decreasing-numbers",
    "titleEn": "Decreasing Numbers: Abacus Subtraction, Borrowing & Indian Currency",
    "titleMl": "സംഖ്യകൾ കുറയുന്നു: അബാക്കസ് കുറയ്ക്കലും ഇന്ത്യൻ കറൻസിയും",
    "subject": "Mathematics",
    "grade": "Class 4",
    "chapter": "അധ്യായം 6: സംഖ്യകൾ കുറയുന്നു",
    "descriptionEn": "Master subtraction with borrowing on a 4-spike abacus, standard vertical written subtraction, column alignment, and Indian currency notes and coins transactions.",
    "descriptionMl": "അബാക്കസിൽ കൂട്ടം മാറ്റി കുറയ്ക്കൽ, വരിയായി എഴുതി കുറയ്ക്കൽ, ഇന്ത്യൻ കറൻസി നോട്ടുകളും നാണയങ്ങളും ഉപയോഗിച്ചുള്ള കൊടുക്കൽ വാങ്ങലുകൾ എന്നിവ പരിശീലിക്കാം.",
    "durationMinutes": 35,
    "tags": ["SCERT Kerala", "Mathematics", "Class 4", "Subtraction", "Abacus", "Regrouping", "Currency", "Money", "Smartboard Ready"],
    "createdAt": "2026-11-12T10:00:00Z",
    "version": 1,
    "approvalStatus": "approved",
    "learningObjectivesEn": [
        "Perform multi-digit subtraction using 4-column place value representation.",
        "Demonstrate unbundling and regrouping (borrowing 1 Ten for 10 Ones, 1 Hundred for 10 Tens).",
        "Compare abacus subtraction directly with standard written vertical subtraction.",
        "Identify Indian coins and banknotes and calculate balances/change in real-life shop transactions."
    ],
    "learningObjectivesMl": [
        "സ്ഥാനവില അടിസ്ഥാനമാക്കി അബാക്കസിൽ മുത്തുകൾ മാറ്റി കുറയ്ക്കാൻ പഠിക്കുക.",
        "കടമെടുക്കൽ / കൂട്ടം മാറ്റൽ (1 പത്ത് = 10 ഒന്നുകൾ) വ്യക്തമായി മനസ്സിലാക്കുക.",
        "അബാക്കസ് രീതിയും വരിയായി എഴുതി കുറയ്ക്കലും തമ്മിൽ താരതമ്യം ചെയ്യുക.",
        "ഇന്ത്യൻ നോട്ടുകളും നാണയങ്ങളും ഉപയോഗിച്ച് തുക നൽകാനും ബാക്കി കണക്കാക്കാനും പരിശീലിക്കുക."
    ],
    "concepts": [
        {
            "id": "c6-1",
            "titleEn": "Subtraction by Bead Removal on Abacus",
            "titleMl": "അബാക്കസിൽ മുത്തുകൾ മാറ്റി കുറയ്ക്കൽ",
            "explanationEn": "To subtract on an abacus, we represent the first number (minuend) with beads, then remove the beads corresponding to the number being subtracted (subtrahend).",
            "explanationMl": "ആദ്യം വലിയ സംഖ്യയ്ക്കുള്ള മുത്തുകൾ ഇടുന്നു. പിന്നീട് കുറയ്ക്കേണ്ട സംഖ്യയ്ക്കുള്ള മുത്തുകൾ ഓരോ സ്ഥാനത്തുനിന്നും എടുത്തുമാറ്റുന്നു.",
            "realLifeExampleEn": "Counting remaining coconuts after selling some from a harvest pile.",
            "realLifeExampleMl": "വിളവെടുത്ത തേങ്ങകളിൽ നിന്ന് കുറച്ചെണ്ണം വിറ്റ ശേഷം ബാക്കി എണ്ണി തിട്ടപ്പെടുത്തുന്നത് പോലെ.",
            "suggestedVisual": "4-spike abacus showing active bead removal.",
            "sourcePage": "58",
            "evidenceSnippet": "Remove beads from the ones, tens and hundreds rods."
        },
        {
            "id": "c6-2",
            "titleEn": "Regrouping and Borrowing (1 Ten = 10 Ones)",
            "titleMl": "കൂട്ടം മാറ്റലും കടമെടുക്കലും (1 പത്ത് = 10 ഒന്നുകൾ)",
            "explanationEn": "When the top digit in a column is smaller than the bottom digit, we exchange 1 bead from the next higher place value for 10 beads in our current column.",
            "explanationMl": "മുകളിലെ അക്കം ചെറുതാകുമ്പോൾ അടുത്ത ഉയർന്ന സ്ഥാനത്തുനിന്ന് 1 എടുത്ത് 10 ആക്കി മാറ്റി ചേർക്കുന്നു (ഉദാ: 1 പത്ത് = 10 ഒന്നുകൾ).",
            "realLifeExampleEn": "Exchanging a ₹10 note for ten ₹1 coins when you need exact coins.",
            "realLifeExampleMl": "ചില്ലറ ഇല്ലാത്തപ്പോൾ ഒരു ₹10 നോട്ട് നൽകി പത്ത് ₹1 നാണയങ്ങളാക്കി മാറ്റുന്നത്.",
            "suggestedVisual": "Animated unbundling of 1 Ten bead into 10 loose Ones beads.",
            "sourcePage": "60",
            "evidenceSnippet": "Exchange one ten for ten ones before subtracting."
        },
        {
            "id": "c6-3",
            "titleEn": "Standard Vertical Written Subtraction",
            "titleMl": "വരിയായി എഴുതി കുറയ്ക്കൽ",
            "explanationEn": "We align numbers by their place values (H, T, O). Slashes show where a digit was reduced during borrowing, keeping steps neat and error-free.",
            "explanationMl": "നൂറുകൾ, പത്തുകൾ, ഒന്നുകൾ എന്നിവ നേരെ താഴെ വരിയായി എഴുതി കടമെടുത്തത് വെട്ടി എഴുതി കുറയ്ക്കുന്നു.",
            "realLifeExampleEn": "Writing down expenditure in a family monthly budget notebook.",
            "realLifeExampleMl": "വീട്ടുചെലവ് കണക്ക് ബുക്കിൽ എഴുതി സൂക്ഷിക്കുന്നത്.",
            "suggestedVisual": "Interactive vertical chalkboard with slashed borrowing digits.",
            "sourcePage": "62",
            "evidenceSnippet": "Align digits vertically in columns before computing."
        },
        {
            "id": "c6-4",
            "titleEn": "Indian Currency: Notes, Coins & Change",
            "titleMl": "ഇന്ത്യൻ കറൻസി: നോട്ടുകളും നാണയങ്ങളും ബാക്കി തുകയും",
            "explanationEn": "Using ₹1, ₹2, ₹5, ₹10, ₹20 coins and ₹10, ₹20, ₹50, ₹100, ₹200, ₹500 notes to pay and calculate remaining balance by subtraction.",
            "explanationMl": "₹1 മുതൽ ₹500 വരെയുള്ള നോട്ടുകളും നാണയങ്ങളും ഉപയോഗിച്ച് സാധനങ്ങൾ വാങ്ങുമ്പോൾ ബാക്കി തുക കുറയ്ക്കൽ വഴി കണ്ടെത്തുന്നു.",
            "realLifeExampleEn": "Buying a geometry box for ₹75 from school store with a ₹100 note (₹100 - ₹75 = ₹25 change).",
            "realLifeExampleMl": "സ്കൂൾ സ്റ്റോറിൽ നിന്ന് ₹75 രൂപയുടെ സാധനം വാങ്ങി ₹100 നൽകുമ്പോൾ ബാക്കി ₹25 ലഭിക്കുന്നത്.",
            "suggestedVisual": "Interactive shop counter with wallet tray and currency tokens.",
            "sourcePage": "65",
            "evidenceSnippet": "Use rupee notes and coins to calculate change."
        }
    ],
    "vocabulary": [
        {
            "id": "v6-1",
            "word": "Regrouping / കൂട്ടം മാറ്റൽ",
            "meaningEn": "Exchanging a higher place value unit for 10 units of the lower place value.",
            "meaningMl": "ഉയർന്ന സ്ഥാനവിലയിൽ നിന്ന് 1 എടുത്ത് താഴ്ന്ന സ്ഥാനത്ത് 10 ആക്കി മാറ്റുന്ന രീതി.",
            "exampleEn": "In 352 - 128, we regrouped 1 ten into 10 ones to get 12 ones.",
            "exampleMl": "352 ൽ നിന്ന് 128 കുറയ്ക്കാൻ 1 പത്തിനെ 10 ഒന്നുകളാക്കി മാറ്റി."
        },
        {
            "id": "v6-2",
            "word": "Rupee (₹) / ഇന്ത്യൻ രൂപ",
            "meaningEn": "The official currency unit of the Republic of India.",
            "meaningMl": "ഭാരതത്തിന്റെ ഔദ്യോഗിക നാണയം.",
            "exampleEn": "The price of the storybook was ₹135.",
            "exampleMl": "കഥാപുസ്തകത്തിന്റെ വില ₹135 ആയിരുന്നു."
        }
    ],
    "activities": [
        {
            "id": "act-abacus-sub",
            "titleEn": "Abacus Subtraction Simulator",
            "titleMl": "അബാക്കസ് കുറയ്ക്കൽ സിമുലേറ്റർ",
            "activityType": "abacus_subtraction",
            "learningObjectiveEn": "Remove beads and demonstrate place-value regrouping visibly.",
            "learningObjectiveMl": "മുത്തുകൾ മാറ്റി കുറയ്ക്കാനും കൂട്ടം മാറ്റൽ കാണാനും സാധിക്കുക.",
            "instructionEn": "Step through 352 - 128, exchange 1 ten for 10 ones, and remove beads.",
            "instructionMl": "ഘട്ടങ്ങളായി 1 പത്ത് മാറ്റി 10 ഒന്നുകളാക്കി മുത്തുകൾ നീക്കം ചെയ്യുക.",
            "activityModule": "abacus_subtraction"
        },
        {
            "id": "act-written-sub",
            "titleEn": "Standard Written Subtraction Board",
            "titleMl": "വരിയായി എഴുതി കുറയ്ക്കൽ ബോർഡ്",
            "activityType": "written_subtraction",
            "learningObjectiveEn": "Perform vertical column subtraction with borrowing slashes and method comparison.",
            "learningObjectiveMl": "കോളങ്ങൾ ക്രമീകരിച്ച് കടമെടുക്കൽ സൂചിപ്പിച്ച് കുറയ്ക്കുക.",
            "instructionEn": "Select each column, borrow where needed, and calculate each digit.",
            "instructionMl": "ഓരോ കോളവും പരിശോധിച്ച് കടമെടുത്ത് ഉത്തരം നൽകുക.",
            "activityModule": "written_subtraction"
        },
        {
            "id": "act-currency",
            "titleEn": "Notes and Coins Shop",
            "titleMl": "നാണയങ്ങളും നോട്ടുകളും കട",
            "activityType": "currency_explorer",
            "learningObjectiveEn": "Select coins and banknotes, build amounts, and calculate store change.",
            "learningObjectiveMl": "നോട്ടുകളും നാണയങ്ങളും തിരഞ്ഞെടുത്ത് തുകയുണ്ടാക്കാനും ബാക്കി നൽകാനും പരിശീലിക്കുക.",
            "instructionEn": "Drag/click notes and coins into the wallet tray to solve the payment challenges.",
            "instructionMl": "ട്രേയിലേക്ക് നോട്ടുകളും നാണയങ്ങളും നൽകി വെല്ലുവിളികൾ പൂർത്തിയാക്കുക.",
            "activityModule": "currency_explorer"
        }
    ],
    "slides": [
        {
            "id": "s6-1",
            "slideType": "interactive_activity",
            "titleEn": "Abacus Subtraction Simulator with Regrouping",
            "titleMl": "അബാക്കസ് കുറയ്ക്കൽ: കൂട്ടം മാറ്റൽ സിമുലേഷൻ",
            "contentEn": "Watch how 352 − 128 is computed! When 2 ones cannot subtract 8 ones, 1 ten is unbundled into 10 ones on the abacus spikes.",
            "contentMl": "352 ൽ നിന്ന് 128 കുറയ്ക്കുന്നത് കാണാം! 2 ൽ നിന്ന് 8 കുറയ്ക്കാൻ കഴിയാതെ വരുമ്പോൾ 1 പത്തിനെ 10 ഒന്നുകളാക്കി മാറ്റുന്നു.",
            "visualType": "interactive_activity",
            "interactiveModule": "abacus_subtraction",
            "keyPointsEn": ["Start with 352", "Exchange 1 ten for 10 ones (Now 4 tens, 12 ones)", "Remove 8 ones, 2 tens, 1 hundred = 224"],
            "keyPointsMl": ["തുടക്കം 352", "1 പത്ത് മാറ്റി 10 ഒന്നുകൾ (ഇപ്പോൾ 4 പത്തും 12 ഒന്നും)", "മുത്തുകൾ നീക്കി ഫലം 224 കണ്ടെത്തുന്നു"],
            "sourcePageRef": "Page 58",
            "evidenceSnippet": "Demonstrate regrouping on abacus rods."
        },
        {
            "id": "s6-2",
            "slideType": "interactive_activity",
            "titleEn": "Standard Vertical Subtraction Board",
            "titleMl": "വരിയായി എഴുതി കുറയ്ക്കൽ ബോർഡ്",
            "contentEn": "Practice column subtraction one place at a time. See slashes when borrowing occurs and toggle the abacus method comparison.",
            "contentMl": "ഓരോ കോളമായി വരിയായി കുറയ്ക്കാം. കടമെടുക്കുമ്പോൾ വെട്ടി എഴുതുന്നതും അബാക്കസ് താരതമ്യവും കാണാം.",
            "visualType": "interactive_activity",
            "interactiveModule": "written_subtraction",
            "keyPointsEn": ["Align Hundreds, Tens, Ones", "Slash top digit when borrowing", "Method comparison with abacus"],
            "keyPointsMl": ["സ്ഥാനക്രമം കൃത്യമായി പാലിക്കുക", "കടമെടുക്കുമ്പോൾ മുകളിലെ അക്കം വെട്ടി എഴുതുക", "അബാക്കസ് രീതിയുമായി താരതമ്യം"],
            "sourcePageRef": "Page 62",
            "evidenceSnippet": "Align digits vertically in columns."
        },
        {
            "id": "s6-3",
            "slideType": "interactive_activity",
            "titleEn": "Indian Currency Notes and Coins Shop",
            "titleMl": "ഇന്ത്യൻ കറൻസി നോട്ടുകളും നാണയങ്ങളും കട",
            "contentEn": "Touch coins (₹1, ₹2, ₹5, ₹10, ₹20) and banknotes (₹10 to ₹500) to pay for school shop items and calculate remaining change by subtraction!",
            "contentMl": "സ്കൂൾ സ്റ്റോറിലെ സാധനങ്ങൾ വാങ്ങാനും ബാക്കി തുക കുറയ്ക്കൽ വഴി കണ്ടെത്താനും നോട്ടുകളും നാണയങ്ങളും ട്രേയിൽ വെയ്ക്കൂ!",
            "visualType": "interactive_activity",
            "interactiveModule": "currency_explorer",
            "keyPointsEn": ["Official Indian currency symbol ₹", "Pay exact amounts", "Change = Amount Paid - Cost"],
            "keyPointsMl": ["ഇന്ത്യൻ രൂപയുടെ ചിഹ്നം ₹", "കൃത്യമായ തുക നൽകുക", "ബാക്കി = നൽകിയ തുക - സാധനത്തിന്റെ വില"],
            "sourcePageRef": "Page 65",
            "evidenceSnippet": "Make ₹50, ₹75 and calculate change from ₹200."
        }
    ],
    "quiz": [
        {
            "id": "q6-1",
            "type": "multiple_choice",
            "questionEn": "What is 352 − 128?",
            "questionMl": "352 ൽ നിന്ന് 128 കുറച്ചാൽ എത്ര?",
            "optionsEn": ["224", "234", "226", "214"],
            "optionsMl": ["224", "234", "226", "214"],
            "correctIndex": 0,
            "explanationEn": "Borrowing 1 ten makes ones 12. 12 - 8 = 4 ones. 4 tens - 2 tens = 2 tens. 3 hundreds - 1 hundred = 2 hundreds. Result = 224.",
            "explanationMl": "1 പത്ത് കടമെടുക്കുമ്പോൾ 12 ഒന്നുകൾ. 12 - 8 = 4. 4 പത്ത് - 2 പത്ത് = 2. 3 നൂറ് - 1 നൂറ് = 2. ആകെ = 224."
        },
        {
            "id": "q6-2",
            "type": "multiple_choice",
            "questionEn": "When you borrow 1 Ten, how many Ones do you receive?",
            "questionMl": "1 പത്ത് കടമെടുക്കുമ്പോൾ എത്ര ഒന്നുകളാണ് ലഭിക്കുന്നത്?",
            "optionsEn": ["10 Ones", "5 Ones", "1 One", "100 Ones"],
            "optionsMl": ["10 ഒന്നുകൾ", "5 ഒന്നുകൾ", "1 ഒന്ന്", "100 ഒന്നുകൾ"],
            "correctIndex": 0,
            "explanationEn": "1 Ten = 10 Ones.",
            "explanationMl": "1 പത്ത് = 10 ഒന്നുകൾ."
        },
        {
            "id": "q6-3",
            "type": "multiple_choice",
            "questionEn": "You buy a book for ₹135 using a ₹200 note. What is your change?",
            "questionMl": "₹135 രൂപയുടെ പുസ്തകം വാങ്ങാൻ ₹200 നോട്ട് നൽകിയാൽ ബാക്കി എത്ര ലഭിക്കും?",
            "optionsEn": ["₹65", "₹75", "₹55", "₹60"],
            "optionsMl": ["₹65", "₹75", "₹55", "₹60"],
            "correctIndex": 0,
            "explanationEn": "₹200 − ₹135 = ₹65.",
            "explanationMl": "₹200 − ₹135 = ₹65."
        }
    ]
}

def update_math_ts():
    print(f"Reading {MATH_TS_PATH}...")
    with open(MATH_TS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    if "scert-std4-maths-ch5-its-time" in content:
        print("Chapters 5 and 6 already present in mathLessons.ts.")
        return

    # Find the end of SCERT_MATH_LESSONS array
    end_bracket_idx = content.rfind('];')
    if end_bracket_idx == -1:
        raise Exception("Could not find closing bracket in mathLessons.ts")

    # Format JSON as TypeScript objects
    ch5_ts = "  // =========================================================================\n" \
             "  // CHAPTER 5 — IT'S TIME! (സമയം എത്രയായി?)\n" \
             "  // =========================================================================\n" + \
             "  " + json.dumps(CHAPTER_5, indent=2, ensure_ascii=False).replace("\n", "\n  ") + ",\n\n"

    ch6_ts = "  // =========================================================================\n" \
             "  // CHAPTER 6 — DECREASING NUMBERS (സംഖ്യകൾ കുറയുന്നു)\n" \
             "  // =========================================================================\n" + \
             "  " + json.dumps(CHAPTER_6, indent=2, ensure_ascii=False).replace("\n", "\n  ") + "\n"

    new_content = content[:end_bracket_idx].rstrip() + ",\n\n" + ch5_ts + ch6_ts + "];\n"

    with open(MATH_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated frontend/src/data/mathLessons.ts successfully with Chapters 5 and 6.")

def update_sample_data_py():
    print(f"Updating {SAMPLE_DATA_PATH}...")
    with open(SAMPLE_DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    if "scert-std4-maths-ch5-its-time" in content:
        print("Chapters 5 and 6 already present in sample_data.py.")
        return

    # Insert Chapters 5 and 6 into SAMPLE_LESSONS list in sample_data.py
    end_bracket_idx = content.rfind(']')
    if end_bracket_idx == -1:
        raise Exception("Could not find closing bracket in sample_data.py")

    ch5_py = "    " + json.dumps(CHAPTER_5, indent=4, ensure_ascii=False).replace("\n", "\n    ") + ",\n"
    ch6_py = "    " + json.dumps(CHAPTER_6, indent=4, ensure_ascii=False).replace("\n", "\n    ") + "\n"

    new_content = content[:end_bracket_idx].rstrip() + ",\n" + ch5_py + ch6_py + "]\n"

    with open(SAMPLE_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated backend/app/sample_data.py successfully with Chapters 5 and 6.")

def update_sqlite_db():
    print(f"Connecting to {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Check chapters table
    existing_chapter_ids = [row[0] for row in cur.execute("SELECT id FROM chapters").fetchall()]
    if "ch-5" not in existing_chapter_ids:
        cur.execute("""
            INSERT INTO chapters (id, title, grade, subject, original_filename, file_hash, extracted_text, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, ("ch-5", CHAPTER_5["titleEn"], "Class 4", "Mathematics", "04_Mathematics_SCERT.pdf", "hash_ch5", "It's Time! Clocks and Calendar"))
        print("Inserted Chapter 5 into chapters table.")

    if "ch-6" not in existing_chapter_ids:
        cur.execute("""
            INSERT INTO chapters (id, title, grade, subject, original_filename, file_hash, extracted_text, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, ("ch-6", CHAPTER_6["titleEn"], "Class 4", "Mathematics", "04_Mathematics_SCERT.pdf", "hash_ch6", "Decreasing Numbers Subtraction and Currency"))
        print("Inserted Chapter 6 into chapters table.")

    # Insert lesson versions into lesson_versions table
    existing_lesson_ids = [row[0] for row in cur.execute("SELECT id FROM lesson_versions").fetchall()]
    
    ch5_version_id = "scert-std4-maths-ch5-its-time-v1"
    if ch5_version_id not in existing_lesson_ids:
        cur.execute("""
            INSERT INTO lesson_versions (id, chapter_id, version, approval_status, lesson_data, start_page, end_page, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            ch5_version_id,
            "ch-5",
            1,
            "approved",
            json.dumps(CHAPTER_5, ensure_ascii=False),
            45,
            54
        ))
        print(f"Inserted {ch5_version_id} into lesson_versions table.")

    ch6_version_id = "scert-std4-maths-ch6-decreasing-numbers-v1"
    if ch6_version_id not in existing_lesson_ids:
        cur.execute("""
            INSERT INTO lesson_versions (id, chapter_id, version, approval_status, lesson_data, start_page, end_page, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            ch6_version_id,
            "ch-6",
            1,
            "approved",
            json.dumps(CHAPTER_6, ensure_ascii=False),
            55,
            68
        ))
        print(f"Inserted {ch6_version_id} into lesson_versions table.")

    conn.commit()
    conn.close()
    print("Database updated and committed successfully.")

if __name__ == '__main__':
    update_math_ts()
    update_sample_data_py()
    update_sqlite_db()
    print("All Chapter 5 and Chapter 6 curriculum data integrated seamlessly!")
