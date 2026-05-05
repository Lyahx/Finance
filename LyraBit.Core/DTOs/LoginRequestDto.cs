using System.ComponentModel.DataAnnotations;

namespace LyraBit.Core.DTOs;

public sealed class LoginRequestDto
{
    [Required]
    [StringLength(150, MinimumLength = 3)]
    public string EmailOrUsername { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}
