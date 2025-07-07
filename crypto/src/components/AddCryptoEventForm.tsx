import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Props {
  onEventAdded: () => void;
}

const AddCryptoEventForm: React.FC<Props> = ({ onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !date) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        link,
        date: format(date, "yyyy-MM-dd"), // MUST be in correct format
        timestamp: serverTimestamp(),
      });

      setMessage("✅ Event added!");
      setTitle("");
      setDescription("");
      setLink("");
      setDate(new Date());
      onEventAdded(); // refresh event list
    } catch (err) {
      console.error("Error adding event:", err);
      setMessage("❌ Error saving event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 text-white w-full max-w-4xl mx-auto mb-6">
      <CardHeader>
        <CardTitle>Add Cryptocurrency Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input
          placeholder="Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <div>
          <label className="text-sm text-gray-400">Select Date:</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-gray-800 text-white mt-2"
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </Button>
        {message && <p className="text-sm text-teal-400">{message}</p>}
      </CardContent>
    </Card>
  );
};

export default AddCryptoEventForm;
