

import React, { Component } from 'react';
import axios from 'axios';
import renderIf from 'render-if';
import ListTemplate from './ListTemplate';

class SendMail extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: "",
      text: "",
      subject: "",
      receiver: "",
      templateBody: "",
      templateType: "",
      templateCompany: "",
      TemplateAddressee: "",
      TemplateEmailAddress: "",
      templateResults: [],
      toggleMakeTemplate: false,
      dummySavedJob: {},
      uploadList: [],
      optionState: "please pick a file",
      attachList:[],
      attachListcomma: '',
      savedJobtoEmail: {},
      savedContacttoEmail: {},
      oneWeek: false,
      twoWeek: false,
      threeWeek: false,
      fourWeek: false
    }
    var self = this;
  }

  componentWillMount() {

    var self = this;

      axios.get('http://localhost:5000/upload/getall')
        .then((response)=>{
          console.log('back from upload/getall', response.data);
          const uploadList = self.state.uploadList.concat(response.data);
          self.setState({uploadList});
        })



        if(this.props.savedJobtoEmail.hasOwnProperty('jobTitle') && this.props.updatedJob===true){

          self.setState({
             savedJobtoEmail: this.props.savedJobtoEmail,
             savedContacttoEmail:{},

           })
        }
        if(this.props.savedContacttoEmail.hasOwnProperty('name') && this.props.updatedEmail===true){

          self.setState({
            savedJobtoEmail: {},
            savedContacttoEmail:this.props.savedContacttoEmail,
            text:'Dear '+ this.props.savedContacttoEmail.name + ', ',
            receiver:this.props.savedContacttoEmail.email,
            updatedJob: false,
            updatedEmail: true
          })
        }


  }




  sendMyEmail(e){
    e.preventDefault();
    var self = this;
    var username = this.state.username;
    var password = this.state.password;
    var text = this.state.text;
    var subject = this.state.subject;
    var receiver = this.state.receiver;
    var attachList = this.state.attachList;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var today = mm+'/'+dd+'/'+yyyy;

    var emailname = "to: " + receiver + " subject: " + subject;



    this.setState({
      username: "",
      password: "",
      text: "",
      subject: "",
      receiver: "",
      attachList:[]
    })
      axios.post('http://localhost:5000/email/sendemail',{
        username: username,
        password: password,
        text: text,
        subject: subject,
        receiver: receiver,
        attachments: attachList
      })
      .then((response)=>{
        console.log('inside the after sendemail axios post in sendmail');

        axios.post('http://localhost:5000/calendar/addgoal',{
          name: emailname,
          dateDue: today,
          actionType: '***email***',
          notes: text
        })
          .then((response)=>{
            console.log("result from calendarAdd axios post IN EMAIL is ", response)
          })
          .catch(function(error){
            console.error(error);
          });
      })
  }





  createTemplate(e){
    e.preventDefault(e);
    var self = this;
    axios.post('http://localhost:5000/email/addtemplate',{
      body: this.state.templateBody,
    })
    .then((response)=>{
      // console.log("response from sending email ", response);
      self.retrieveTemplates(e);
    })
  }

  sendTemplatetoEmailFormJob(templateText, jobObj){
    console.log('inside sendTemplatetoEmailFormJob');
    var modifiedText = templateText.split("%%company%%").join(jobObj.companyName).split('%%job%%').join(jobObj.jobTitle);
    var self = this;
    self.setState({
      text: modifiedText
    })
  }

  sendTemplatetoEmailForm(templateText){
    console.log('inside sendTemplatetoEmailForm');
    var self = this;
    self.setState({
      text: templateText
    })
  }



  deleteTemplate(template){
    var self = this;
    var url = 'http://localhost:5000/email/deleteItem/' + template._id;

    axios.delete(url)
      .then((response)=>{
        console.log('delete list item response is ', response);
        self.retrieveTemplatesNoE();
      })
      .catch(function(error){
        console.error(error);
      })


  }



  retrieveTemplatesNoE(){

    var self = this;
      axios.post('http://localhost:5000/email/retrievetemplates')
        .then((response)=>{
            var arryAll = [];
            var tempObj = {};

            response.data.forEach((template)=>{
              tempObj = {};
              tempObj.body = template.body;
              tempObj._id = template._id;
              arryAll.push(tempObj);
            });
            self.setState({
              templateResults: arryAll
            });
          });
     this.forceUpdate();

  }






  retrieveTemplates(e){
    e.preventDefault();

    var self = this;
      axios.post('http://localhost:5000/email/retrievetemplates')
        .then((response)=>{
            var arryAll = [];
            var tempObj = {};

            response.data.forEach((template)=>{
              tempObj = {};
              tempObj.body = template.body;
              tempObj._id = template._id;
              arryAll.push(tempObj);
            });
            self.setState({
              templateResults: arryAll
            });
          });
     this.forceUpdate();

  }

  attachFile(e){
    e.preventDefault();
    var self = this;
    if (self.state.optionState!="please select a file"){
      const attachList = self.state.attachList.concat(self.state.optionState);
      self.setState({attachList},()=>{
        console.log('value of attachList after setting ', this.state.attachList);
        const attachListcomma = this.state.attachList.join(', ')
        self.setState({attachListcomma});
      });
    }





  }


  removeSavedJob(e){
    e.preventDefault();
    this.setState({
      savedJobtoEmail: {}
    })
  }


  toggleTemplateMaker(e){
    e.preventDefault();

    var self = this;

    if(self.state.toggleMakeTemplate===false){
      self.setState({
        toggleMakeTemplate: true
      })
    }

    if(self.state.toggleMakeTemplate===true){
      self.setState({
        toggleMakeTemplate: false
      })
    }
  }


  delayedEmail(e){
    e.preventDefault();
    var self = this;


    var self = this;
    var username = this.state.username;
    var password = this.state.password;
    var text = this.state.text;
    var subject = this.state.subject;
    var receiver = this.state.receiver;
    var attachList = this.state.attachList;
    var oneWeek = this.state.oneWeek;
    var twoWeek = this.state.twoWeek;
    var threeWeek = this.state.threeWeek;
    var fourWeek = this.state.fourWeek;

    var emailname = "to: " + receiver + " subject: " + subject;

    var oneWeekaheadDate = new Date();
    var twoWeekaheadDate = new Date();
    var threeWeekaheadDate = new Date();
    var threeWeekaheadDate = new Date();

    if (oneWeek){
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      var dd = targetDate.getDate();
      var mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
      var yyyy = targetDate.getFullYear();
      var dateString = mm + "/" + dd + "/" + yyyy;
      var oneWeekaheadDate = dateString;
    }

    if (twoWeek){
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 14);
      var dd = targetDate.getDate();
      var mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
      var yyyy = targetDate.getFullYear();
      var dateString = mm + "/" + dd + "/" + yyyy;
      var twoWeekaheadDate = dateString;
    }

    if (threeWeek){
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 21);
      var dd = targetDate.getDate();
      var mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
      var yyyy = targetDate.getFullYear();
      var dateString = mm + "/" + dd + "/" + yyyy;
      var threeWeekaheadDate = dateString;
    }

    if (fourWeek){
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 28);
      var dd = targetDate.getDate();
      var mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
      var yyyy = targetDate.getFullYear();
      var dateString = mm + "/" + dd + "/" + yyyy;
      var fourWeekaheadDate = dateString;
    }


    this.setState({
      username: "",
      password: "",
      text: "",
      subject: "",
      receiver: "",
      attachList:[],
      oneWeek: false,
      twoWeek: false,
      threeWeek: false,
      fourWeek: false
    })
      axios.post('http://localhost:5000/email/delayedemail',{
        username: username,
        password: password,
        text: text,
        subject: subject,
        receiver: receiver,
        attachments: attachList,
        oneWeek: oneWeek,
        twoWeek: twoWeek,
        threeWeek: threeWeek,
        fourWeek: fourWeek,
        oneWeekaheadDate: oneWeekaheadDate,
        twoWeekaheadDate: twoWeekaheadDate,
        threeWeekaheadDate: threeWeekaheadDate,
        fourWeekaheadDate: fourWeekaheadDate,
      })
      .then((response)=>{
        console.log('inside the after delayedemail axios post in sendmail');


        if (oneWeek){
          axios.post('http://localhost:5000/calendar/addgoal',{
            name: emailname,
            dateDue: oneWeekaheadDate,
            actionType: '***email***',
            notes: text
          })
            .then((response)=>{
              console.log("result from calendarAdd axios post IN EMAIL is ", response)
            })
            .catch(function(error){
              console.error(error);
            });
        }

        if (twoWeek){
          axios.post('http://localhost:5000/calendar/addgoal',{
            name: emailname,
            dateDue: twoWeekaheadDate,
            actionType: '***email***',
            notes: text
          })
            .then((response)=>{
              console.log("result from calendarAdd axios post IN EMAIL is ", response)
            })
            .catch(function(error){
              console.error(error);
            });
        }

        if (threeWeek){
          axios.post('http://localhost:5000/calendar/addgoal',{
            name: emailname,
            dateDue: threeWeekaheadDate,
            actionType: '***email***',
            notes: text
          })
            .then((response)=>{
              console.log("result from calendarAdd axios post IN EMAIL is ", response)
            })
            .catch(function(error){
              console.error(error);
            });
        }


        if (fourWeek){
          axios.post('http://localhost:5000/calendar/addgoal',{
            name: emailname,
            dateDue: fourWeekaheadDate,
            actionType: '***email***',
            notes: text
          })
            .then((response)=>{
              console.log("result from calendarAdd axios post IN EMAIL is ", response)
            })
            .catch(function(error){
              console.error(error);
            });
        }




      });
  }


  render() {

    let option = [];
    option.push(<option key={0} value="please select">please select a file</option>)
    var key = 1;
    console.log('this.state.uploadList in render ', this.state.uploadList);
    this.state.uploadList.map(item => {
        option.push(<option key={key} value={item}>{item}</option>)
        key++;
      }
    );
    console.log('value of options after map ', option);





      let listTemplates;

      if(this.state.templateResults.length!=0){
            listTemplates = this.state.templateResults.map((template,i) => {
              if (this.props.savedJobtoEmail.hasOwnProperty("jobTitle")){
                console.log('inside hasOwnProperty jobTitle SENDMAIL')
                return (
                  <ListTemplate key={i} template={template} sendTemplatetoEmailFormJob={this.sendTemplatetoEmailFormJob.bind(this)}
                  savedJobtoEmail={this.props.savedJobtoEmail}
                  deleteTemplate={this.deleteTemplate.bind(this)}/>
                );
              }else{
                console.log('inside DOES NOT hasOwnProperty jobTitle SENDMAIL')
                return (
                  <ListTemplate key={i} template={template} sendTemplatetoEmailForm={this.sendTemplatetoEmailForm.bind(this)}
                  savedJobtoEmail={this.state.dummySavedJob}
                  deleteTemplate={this.deleteTemplate.bind(this)}/>
                );
              }
            });
      }
      if(this.state.templateResults.length===0){
        listTemplates = <div><p> Search for templates to populate! If there are none, add some! </p></div>
      }

          return (
            <div>
              <h1>Send Mail!</h1>

              <form>
                <input
                        onChange={(e)=>this.setState({username: e.target.value })}
                        type="text"
                        name="username"
                        id="username"
                        value={this.state.username}
                        placeholder="username"/>
                <input
                        onChange={(e)=>this.setState({password: e.target.value })}
                        type="text"
                        name="password"
                        id="password"
                        value={this.state.password}
                        placeholder="password"/>
                <input
                        onChange={(e)=>this.setState({receiver: e.target.value })}
                        type="text"
                        name="receiver"
                        id="receiver"
                        value={this.state.receiver}
                        placeholder="receiver"/>
                <input
                        onChange={(e)=>this.setState({subject: e.target.value })}
                        type="text"
                        name="subject"
                        id="subject"
                        value={this.state.subject}
                        placeholder="subject"/>
                <textarea rows="4" cols="50"
                        onChange={(e)=>this.setState({text: e.target.value })}
                        name="text"
                        id="text"
                        value={this.state.text}
                        placeholder="text"
                ></textarea>
                <select
                onChange={(e)=>this.setState({optionState:e.target.value})}>
                  {option}
                </select>
                <button onClick={(e)=>this.attachFile(e)}>Attach File!</button>
                <button onClick={(e)=>this.sendMyEmail(e)}>Send Email!</button>

                  <p> Check the boxes for delayed emails </p>
                  <div className="checkbox">
                    <input type='checkbox' checked={this.state.oneWeek} onClick={()=>{
                      if(this.state.oneWeek===false){
                        this.setState({
                          oneWeek:true
                        })
                      }
                      if(this.state.oneWeek===true){
                        this.setState({
                          oneWeek:false
                        })
                      }
                    }}/><p>Send An Email in a Week</p>
                  </div>
                  <div className="checkbox">
                    <input className="checkbox" checked={this.state.twoWeek} type='checkbox' onClick={()=>{
                      if(this.state.twoWeek===false){
                        this.setState({
                          twoWeek:true
                        })
                      }
                      if(this.state.twoWeek===true){
                        this.setState({
                          twoWeek:false
                        })
                      }
                    }}/><p className="checkbox">Send An Email in Two Weeks</p>
                  </div>
                  <div className="checkbox">
                    <input className="checkbox"  checked={this.state.threeWeek} type='checkbox' onClick={()=>{
                      if(this.state.threeWeek===false){
                        this.setState({
                          threeWeek:true
                        })
                      }
                      if(this.state.threeWeek===true){
                        this.setState({
                          threeWeek:false
                        })
                      }
                    }}/><p className="checkbox">Send An Email in Three Weeks</p>
                  </div>
                  <div className="checkbox">
                    <input className="checkbox"  checked={this.state.fourWeek} type='checkbox' onClick={()=>{
                      if(this.state.fourWeek===false){
                        this.setState({
                          fourWeek:true
                        })
                      }
                      if(this.state.fourWeek===true){
                        this.setState({
                          fourWeek:false
                        })
                      }
                    }}/><p className="checkbox">Send An Email in Four Weeks</p>
                  </div>
                  <button onClick={(e)=>this.delayedEmail(e)}>Send Delayed Email!</button>
              </form>





              {renderIf(this.state.attachList.length===0)(
                <div>
                  <p>You have no files attached!</p>
                </div>
              )}
              {renderIf(this.state.attachList.length!=0)(
                <div>
                  <p>You have attached these files:</p>{this.state.attachListcomma}
                </div>
              )}



              <br/>
              {renderIf(this.state.toggleMakeTemplate)(
                <div className='templateMakerDiv toggleTemplate'>
                  <h1>Make New Mail Template!</h1>

                  <form className="templateMakerForm">
                    <textarea rows="10" cols="100"
                            onChange={(e)=>this.setState({templateBody: e.target.value })}
                            name="text"
                            id="text"
                            value={this.state.templateBody}
                            placeholder="text"
                    ></textarea>
                    <button onClick={(e)=>this.createTemplate(e)}>create this template!</button>
                    <button onClick={(e)=>this.sendTemplatetoEmailForm(e)}>send this template to email form!</button>
                  </form>

                    <button onClick={(e)=>this.toggleTemplateMaker(e)}>Hide Template Maker!</button>
                </div>
              )}

              {renderIf(this.state.toggleMakeTemplate===false)(
                  <button className="toggleTemplate" onClick={(e)=>this.toggleTemplateMaker(e)}>Show Template Maker!</button>
              )}


              <br/>
              <button onClick={(e)=>this.retrieveTemplates(e)}>retrieve saved templates!</button>




              <br/>
              <div className='savedJobsList jobListing jobsList'>
                {listTemplates}
              </div>

              <br/>

              {renderIf(this.state.savedJobtoEmail.hasOwnProperty("jobTitle"))(
                <div className='savedJobsList jobListing jobsList'>
                  <h2>This saved Job was sent to email!</h2>
                  <h3><strong>{this.state.savedJobtoEmail.jobTitle}</strong></h3>
                  <h4>{this.state.savedJobtoEmail.jobLink}</h4>
                  <h4>{this.state.savedJobtoEmail.companyName}</h4>
                  <h4>{this.state.savedJobtoEmail.jobLocation}</h4>
                  <h4>{this.state.savedJobtoEmail.jobDescription}</h4>
                  <h3>job status: {this.state.savedJobtoEmail.jobStatus}</h3>
                  <button onClick={(e)=>this.removeSavedJob(e)}>Remove Saved Job from Email!</button>
                </div>
              )}

              {renderIf(this.state.savedContacttoEmail.hasOwnProperty("name"))(
                <div className='savedJobsList jobListing jobsList'>
                  <h2>This Contact was sent to email!</h2>
                  <h3>Here are your notes on this guy :D</h3>
                  <h4>{this.state.savedContacttoEmail.notes}</h4>
                </div>
              )}

            </div>
          );
        }
}

export default SendMail;
