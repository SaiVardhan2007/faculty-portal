import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

const StudentFooter: React.FC = () => {
  const [addStudentData, setAddStudentData] = useState({ roll_number: "", name: "" });
  const [addStudentLoading, setAddStudentLoading] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);

  const student_mode = true;

  function onRollChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddStudentData({ ...addStudentData, roll_number: e.target.value });
  }

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddStudentData({ ...addStudentData, name: e.target.value });
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    setAddStudentLoading(true);
    
    if (!addStudentData.roll_number || !addStudentData.name) {
      toast.error("Please enter both roll number and name");
      setAddStudentLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('student_requests')
        .insert({
          roll_number: addStudentData.roll_number,
          name: addStudentData.name
        });
      
      if (error) throw error;
      
      toast.success("Request sent successfully!");
      setAddStudentData({ roll_number: "", name: "" });
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Error sending request. Please try again later.");
    }
    setAddStudentLoading(false);
  }

  async function handleSupportSend(e: React.FormEvent) {
    e.preventDefault();
    setSupportLoading(true);
    if (!supportMessage || supportMessage.trim().length < 5) {
      toast.warning("Please enter a valid message (at least 5 characters)");
      setSupportLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("_subject", "Student Contact Support Request");
      formData.append("Message", supportMessage);
      formData.append("Type", "support");
      
      const response = await fetch("https://formsubmit.co/polampallisaivardhan142@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Form submission failed with status: ${response.status}`);
      }
      
      toast.success("Support message sent!");
      setSupportMessage("");
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
    setSupportLoading(false);
  }

  return (
    <footer className="w-full bg-secondary/60 border-t border-border mt-16 py-10">
      <div className="max-w-3xl mx-auto px-4 gap-8 flex flex-col md:flex-row md:gap-12">
        <div className="flex-1 bg-card p-6 rounded-lg shadow hover-scale">
          <h3 className="text-lg font-semibold mb-2">Request to Admin to Add Student</h3>
          <form className="flex flex-col gap-3" onSubmit={handleAddStudent}>
            <label htmlFor="roll-number" className="text-sm">Roll Number</label>
            <Input
              id="roll-number"
              placeholder="Enter your roll number"
              value={addStudentData.roll_number}
              onChange={onRollChange}
              autoComplete="off"
              className="mb-2"
            />
            <label htmlFor="student-name" className="text-sm">Name</label>
            <Input
              id="student-name"
              placeholder="Enter your name"
              value={addStudentData.name}
              onChange={onNameChange}
              autoComplete="off"
              className="mb-2"
            />
            <Button type="submit" className="w-full" disabled={addStudentLoading}>
              {addStudentLoading ? "Sending..." : "Send Credentials"}
            </Button>
          </form>
        </div>
        <div className="flex-1 bg-card p-6 rounded-lg shadow hover-scale">
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
          <form className="flex flex-col gap-3" onSubmit={handleSupportSend}>
            <label htmlFor="support-message" className="text-sm">Describe your problem</label>
            <Textarea
              id="support-message"
              value={supportMessage}
              placeholder="Type your issue or question here..."
              onChange={e => setSupportMessage(e.target.value)}
              className="h-32 mb-2"
              autoFocus={false}
            />
            <Button type="submit" className="w-full" disabled={supportLoading}>
              {supportLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 text-xs text-muted-foreground mt-8 text-center">
        For further help, email: polampallisaivardhan142@gmail.com
      </div>
    </footer>
  );
};

export default StudentFooter;
