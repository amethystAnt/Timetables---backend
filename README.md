# Timetables backend
The backend for my College of Science Timetables Android app.
The purpose of it is to fetch the student's timetable in the icalendar format from the official URL (which has to be provided by the user), parse it and then return the diff (since the last call, indicated by a specified version) as JSON.
  
The app itself can be found here: https://github.com/amethystant/timetables  
Live version of this backend is probably running either on https://timetables.patlejch.co.uk or http://timetables.patlejch.co.uk or both.  
  
This backend so far provides only one endpoint, `GET v1/events`. It has the following URL parametres:  
`url` - the URL where the icalendar shall be fetched  
`version` - the last version of the timetable that the caller received, used to return the diff and not the whole calendar every time  
  
The response looks like this:  
  
```
{
  "objects": [
    {
      "id": 0,
      "start": "20201211T150000Z",
      "end": "20201211T160000Z",
      "summary": "CS-110 Lecture",
      "location": "Computational Foundry 002",
      "version": 0,
      "deleted": false
    }
  ],
  "count": 1,
  "version": 0
}
```
