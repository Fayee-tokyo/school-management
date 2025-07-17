namespace SchoolManagementAPI.DTOs.Auth
{
    public class ChangePasswordDTO
    {
        public string Email { get; set; }
        public string CurrentPassword { get; set; }  // Only used on first login
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
