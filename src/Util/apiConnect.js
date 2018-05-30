import axios from 'axios';


axios.defaults.baseURL = 'http://lms-sep-groupa.azurewebsites.net/api';

// Course
export function getCourses (token) {
    return axios.get('/courses',{
        headers: {'token': token}
    });
}

export function addCourse(data,token) {
    return axios.post('/courses',data,{
        headers: {'token': token}
    });
}

export function getCourseById(id,token) {
    return axios.get(`/courses/${id}`,{
        headers: {'token': token}
    });
}

export function editCourse(data,id,token) {
    return axios.put(`/courses/${id}`,data,{
        headers: {'token': token}
    });
}

export function deleteCourse(id,token) {
    return axios.delete(`/courses/${id}`,{
        headers: {'token': token}
    });
}

//Student
export function getStudents (token) {
    return axios.get('/students',{
        headers: {'token': token}
    });
}

export function addStudent(data,token) {
    return axios.post('/students',data,{
        headers: {'token': token}
    });
}

export function getStudentById(id,token) {
    return axios.get(`/students/${id}`,{
        headers: {'token': token}
    });
}

export function editStudent(data,id,token) {
    return axios.put(`/students/${id}`,data,{
        headers: {'token': token}
    });
}

export function deleteStudent(id,token) {
    return axios.delete(`/students/${id}`,{
        headers: {'token': token}
    });
}

//Lecturer

export function getLecturers (token) {
    return axios.get('/lecturers',{
        headers: {'token': token}
    });
}

export function addLecturer(data,token) {
    return axios.post('/lecturers',data,{
        headers: {'token': token}
    });
}

export function getLecturerById(id,token) {
    return axios.get(`/lecturers/${id}`,{
        headers: {'token': token}
    });
}

export function editLecturer(data,id,token) {
    return axios.put(`/lecturers/${id}`,data,{
        headers: {'token': token}
    });
}

export function deleteLecturer(id,token) {
    return axios.delete(`/lecturers/${id}`,{
        headers: {'token': token}
    });
}

// Enrolment & withdrawal

export function enrolStudent(data, token) {
    return axios.post('/enrolment/student',data,{
        headers: {'token': token}
    });
}

export function withdrawStudent(data, token) {
    return axios({
        method: 'delete',
        url: '/enrolment/student',
        data: data,
        headers: {
            'token': token,
        }
    });
}

export function addLecturerToCourse(data, token) {
    return axios.post('/enrolment/lecturer',data,{
        headers: {'token': token}
    });
}

export function removeLecturerFromCourse(data, token) {
    return axios({
        method: 'delete',
        url: '/enrolment/lecturer',
        data: data,
        headers: {
            'token': token,
        }
    });
}

// Error handler

export function errorHandler(e) {
    if(e.toString().match(/401/)){
        this.setState({errorMessage: "Authentication failed. Please login again."});
        sessionStorage.removeItem("token");
    }else if(e.toString().match(/500/)){
        this.setState({errorMessage: "Server exploded!"});
    }else if(e.toString().match(/409/)){
        this.setState({errorMessage: "Email address existed!"});
    }
}

// Login & verification & sign up

export function login(email,password) {
    return axios.post('/user/login',
        {
            email: email,
            password: password
        },{
            timeout: 15000
        });
}

export function sendLoginSMS(email) {
    return axios.post('/user/sendloginsms',
        {
            email: email,
        },{
            timeout: 15000
        });
}

export function loginWithSMS(email, code) {
    return axios.post('/user/loginwithsms',
        {
            email: email,
            code: code,
        },{
            timeout: 15000
        });
}

export function verification(email, code) {
    return axios.post('/user/verification',
        {
            Email: email,
            VerificationCode: code
        },{
            timeout: 10000
        });
}

export function register(email, password, phone) {
    const phoneNo = `+61${phone.slice(1)}`;
    return axios.post('/user/register',
        {
            Email: email,
            Password: password,
            phone: phoneNo
        },{
            timeout: 10000
        });
}