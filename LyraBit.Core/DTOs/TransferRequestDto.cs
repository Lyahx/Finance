using System.ComponentModel.DataAnnotations;

namespace LyraBit.Core.DTOs;

public sealed class TransferRequestDto
{
    [Required]
    [StringLength(150, MinimumLength = 3)]
    public string ReceiverEmailOrUsername { get; set; } = string.Empty;

    [Required]
    [Range(typeof(decimal), "0.01", "1000000000", ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }
}
