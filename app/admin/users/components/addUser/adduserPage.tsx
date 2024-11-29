"use client";
import { Box, Input, VStack } from "@chakra-ui/react";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/Button/Button";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "@/components/ui/file-upload";

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  headline: z.string().optional(),
  currentPosition: z.string().optional(),
  industry: z.string().optional(),
  location: z.string(),
  education: z.string().optional(),
  about: z.string().optional(),
  website: z.string().url().optional(),
});

export default function AddUserPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    headline: "",
    currentPosition: "",
    industry: "",
    location: "",
    education: "",
    about: "",
    website: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validatedData = userSchema.parse(formData);
      console.log({ ...validatedData, photo });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors);
      }
    }
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Form.Root onSubmit={onSubmit}>
        <VStack gap={6} align="stretch">
          <Box textAlign="center">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              display="none"
              id="photo-upload"
            />
            <FileUploadRoot maxW="xl" alignItems="stretch" maxFiles={10}>
              <FileUploadDropzone
                label="Upload Profile photo"
                description=".png, .jpg up to 5MB"
              />
              <FileUploadList />
            </FileUploadRoot>
          </Box>

          <Form.Field name="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Enter first name" 
              />
            </Form.Control>
            <Form.Message match="valueMissing">Please enter your first name</Form.Message>
          </Form.Field>

          <Form.Field name="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Enter last name" 
              />
            </Form.Control>
            <Form.Message match="valueMissing">Please enter your last name</Form.Message>
          </Form.Field>

          <Form.Field name="email">
            <Form.Label>Email</Form.Label>
            <Form.Control asChild>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address" 
              />
            </Form.Control>
            <Form.Message match="valueMissing">Please enter your email</Form.Message>
            <Form.Message match="typeMismatch">Please provide a valid email</Form.Message>
          </Form.Field>

          <Form.Field name="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control asChild>
              <Input 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="headline">
            <Form.Label>Professional Headline</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.headline}
                onChange={(e) => setFormData({...formData, headline: e.target.value})}
                placeholder="Enter your professional headline" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="currentPosition">
            <Form.Label>Current Position</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.currentPosition}
                onChange={(e) => setFormData({...formData, currentPosition: e.target.value})}
                placeholder="Enter current position" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="industry">
            <Form.Label>Industry</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                placeholder="Enter industry" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="location">
            <Form.Label>Location</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Enter location" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="education">
            <Form.Label>Education</Form.Label>
            <Form.Control asChild>
              <Input 
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
                placeholder="Enter education details" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="about">
            <Form.Label>About</Form.Label>
            <Form.Control asChild>
              <Input 
                as="textarea"
                value={formData.about}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
                placeholder="Tell us about yourself" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="website">
            <Form.Label>Website</Form.Label>
            <Form.Control asChild>
              <Input 
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="Enter website URL" 
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <Button href="#" intent="primary" size="sm">
              Add User
            </Button>
          </Form.Submit>
        </VStack>
      </Form.Root>
    </Box>
  );
}
